const Courses = require("../models/course");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");

// CREATE a new course
exports.createCourse = async (req, res) => {
  try {
    console.log("📥 Incoming Course Data:", req.body);

    // Handle cover image upload
    let coverPath = "";
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      console.log("📸 Uploaded Cover Image:", req.files.coverImage[0].filename);
      coverPath = "/uploads/images/" + req.files.coverImage[0].filename;
    }

    const newCourse = new Courses({
      title: req.body.title,
      description: req.body.description,
      pricingPlan: req.body.pricingPlan,
      totalPrice: req.body.totalPrice,
      discountedPrice: req.body.discountedPrice,
      coverImage: coverPath,
      pdfs: [],
      videos: [],
      quizzes: [],
      assignments: [],
      category: req.body.category || 'General',
      level: req.body.level || 'Beginner',
      duration: req.body.duration || 0,
      language: req.body.language || 'English',
      tags: req.body.tags ? req.body.tags.split(',') : [],
      isPublished: false,
      enrolledStudents: [],
      rating: 0,
      reviews: [],
      createdBy: req.user.id,
    });

    const savedCourse = await newCourse.save();
    console.log("✅ Course saved:", savedCourse);
    res.status(201).json(savedCourse);
  } catch (err) {
    console.error("❌ Error in createCourse:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET all courses with filters and pagination
exports.getAllCourses = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      level, 
      search, 
      sortBy = 'createdAt',
      sortOrder = 'desc',
      priceRange,
      rating
    } = req.query;

    let query = {};
    
    // If user is teacher, show only their courses
    if (req.user.role === 'teacher') {
      query.createdBy = req.user.id;
    } else {
      // For students, show only published courses
      query.isPublished = true;
    }

    // Apply filters
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (level && level !== 'all') {
      query.level = level;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      if (max) {
        query.discountedPrice = { $gte: min, $lte: max };
      } else {
        query.discountedPrice = { $gte: min };
      }
    }
    
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const courses = await Courses.find(query)
      .populate('createdBy', 'username email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Courses.countDocuments(query);

    res.status(200).json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error("❌ Error fetching courses:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET course by ID with detailed info
exports.getCourseById = async (req, res) => {
  try {
    const course = await Courses.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('reviews.user', 'username');
      
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    // Check if user is enrolled (for students)
    let isEnrolled = false;
    if (req.user && req.user.role === 'student') {
      isEnrolled = course.enrolledStudents.includes(req.user.id);
    }
    
    res.status(200).json({ ...course.toObject(), isEnrolled });
  } catch (err) {
    console.error("❌ Error fetching course by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// UPDATE course
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const {
      title,
      description,
      pricingPlan,
      totalPrice,
      discountedPrice,
      category,
      level,
      duration,
      language,
      tags
    } = req.body;

    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if user owns this course
    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Handle new cover image if provided
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      if (course.coverImage) {
        const oldPath = path.join(__dirname, "..", "uploads", "images", path.basename(course.coverImage));
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      course.coverImage = `/uploads/images/${req.files.coverImage[0].filename}`;
    }

    // Update fields
    course.title = title || course.title;
    course.description = description || course.description;
    course.pricingPlan = pricingPlan || course.pricingPlan;
    course.totalPrice = pricingPlan === "one-time" ? totalPrice : 0;
    course.discountedPrice = pricingPlan === "one-time" ? discountedPrice : 0;
    course.category = category || course.category;
    course.level = level || course.level;
    course.duration = duration || course.duration;
    course.language = language || course.language;
    course.tags = tags ? tags.split(',') : course.tags;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    console.error("❌ Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
};

// PUBLISH/UNPUBLISH course
exports.togglePublishCourse = async (req, res) => {
  try {
    const course = await Courses.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.json({ 
      message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
      isPublished: course.isPublished 
    });
  } catch (error) {
    console.error("❌ Error toggling course publish status:", error);
    res.status(500).json({ error: "Failed to update course status" });
  }
};

// ENROLL student in course
exports.enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user.id;

    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (!course.isPublished) {
      return res.status(400).json({ error: "Course is not published" });
    }

    if (course.enrolledStudents.includes(studentId)) {
      return res.status(400).json({ error: "Already enrolled in this course" });
    }

    course.enrolledStudents.push(studentId);
    await course.save();

    res.json({ message: "Successfully enrolled in course" });
  } catch (error) {
    console.error("❌ Error enrolling in course:", error);
    res.status(500).json({ error: "Failed to enroll in course" });
  }
};

// GET enrolled courses for student
exports.getEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    const courses = await Courses.find({ 
      enrolledStudents: studentId,
      isPublished: true 
    }).populate('createdBy', 'username email');

    res.json(courses);
  } catch (error) {
    console.error("❌ Error fetching enrolled courses:", error);
    res.status(500).json({ error: "Failed to fetch enrolled courses" });
  }
};

// ADD review to course
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const courseId = req.params.id;
    const userId = req.user.id;

    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if user is enrolled
    if (!course.enrolledStudents.includes(userId)) {
      return res.status(403).json({ error: "Must be enrolled to review" });
    }

    // Check if user already reviewed
    const existingReview = course.reviews.find(review => 
      review.user.toString() === userId
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.updatedAt = new Date();
    } else {
      course.reviews.push({
        user: userId,
        rating,
        comment,
        createdAt: new Date()
      });
    }

    // Recalculate average rating
    const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
    course.rating = totalRating / course.reviews.length;

    await course.save();
    res.json({ message: "Review added successfully" });
  } catch (error) {
    console.error("❌ Error adding review:", error);
    res.status(500).json({ error: "Failed to add review" });
  }
};

// GET course analytics for teacher
exports.getCourseAnalytics = async (req, res) => {
  try {
    const teacherId = req.user.id;
    
    const courses = await Courses.find({ createdBy: teacherId });
    
    const analytics = {
      totalCourses: courses.length,
      publishedCourses: courses.filter(c => c.isPublished).length,
      totalStudents: courses.reduce((sum, course) => sum + course.enrolledStudents.length, 0),
      averageRating: courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length || 0,
      totalRevenue: courses.reduce((sum, course) => {
        return sum + (course.discountedPrice * course.enrolledStudents.length);
      }, 0),
      courseStats: courses.map(course => ({
        id: course._id,
        title: course.title,
        students: course.enrolledStudents.length,
        rating: course.rating,
        revenue: course.discountedPrice * course.enrolledStudents.length,
        isPublished: course.isPublished
      }))
    };

    res.json(analytics);
  } catch (error) {
    console.error("❌ Error fetching course analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

// DELETE course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Courses.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete associated files
    if (course.coverImage) {
      const imagePath = path.join(__dirname, "..", "uploads", "images", path.basename(course.coverImage));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    course.pdfs.forEach(pdf => {
      const pdfPath = path.join(__dirname, "..", "uploads", "pdfs", path.basename(pdf.url));
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    });

    await Courses.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
};

// GET featured courses
exports.getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Courses.find({ 
      isPublished: true,
      rating: { $gte: 4.0 }
    })
    .populate('createdBy', 'username')
    .sort({ rating: -1, enrolledStudents: -1 })
    .limit(6);

    res.json(courses);
  } catch (error) {
    console.error("❌ Error fetching featured courses:", error);
    res.status(500).json({ error: "Failed to fetch featured courses" });
  }
};

// GET course categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Courses.distinct('category', { isPublished: true });
    res.json(categories);
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};