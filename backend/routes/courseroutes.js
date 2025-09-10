const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const courseController = require("../controllers/courseController");
const Course = require("../models/course");
const auth = require("../middleware/auth");

// Public routes
router.get("/courses/featured", courseController.getFeaturedCourses);
router.get("/courses/categories", courseController.getCategories);
router.get("/courses/public", courseController.getAllCourses);
router.get("/course/:id/public", courseController.getCourseById);

// Protected routes
router.use(auth); // All routes below require authentication

// Course CRUD operations
router.post("/courses/create", upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "PDFfile", maxCount: 1 },
]), courseController.createCourse);

router.get("/courses", courseController.getAllCourses);
router.get("/course/:id", courseController.getCourseById);

router.put("/course/:id", upload.fields([
  { name: "coverImage", maxCount: 1 },
]), courseController.updateCourse);

router.delete("/course/:id", courseController.deleteCourse);

// Course publishing
router.patch("/course/:id/publish", courseController.togglePublishCourse);

// Student enrollment
router.post("/course/:id/enroll", courseController.enrollInCourse);
router.get("/courses/enrolled", courseController.getEnrolledCourses);

// Reviews
router.post("/course/:id/review", courseController.addReview);

// Analytics (teacher only)
router.get("/analytics/courses", courseController.getCourseAnalytics);

// File uploads
router.post("/upload-cover", upload.single("coverImage"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Cover image is missing" });
  }

  console.log("✅ Uploaded cover image:", req.file.filename);
  res.status(200).json({
    message: "Cover image uploaded successfully",
    filePath: `/uploads/images/${req.file.filename}`,
  });
});

router.post("/upload-pdf", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "PDF file is missing" });
  }

  console.log("✅ Uploaded PDF file:", req.file.filename);
  res.status(200).json({
    message: "PDF uploaded successfully",
    filePath: `/uploads/pdfs/${req.file.filename}`,
  });
});

// Upload PDF to specific course
router.post("/course/:id/upload-pdf", upload.single("pdf"), async (req, res) => {
  try {
    const courseId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: "PDF file is missing" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if user owns this course
    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const pdfPath = `/uploads/pdfs/${req.file.filename}`;

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { pdfs: { title: req.file.originalname, url: pdfPath } } },
      { new: true }
    );

    res.status(200).json({
      message: "PDF uploaded and saved to course",
      updatedCourse,
    });
  } catch (error) {
    console.error("❌ Error uploading PDF to course:", error);
    res.status(500).json({ error: "Failed to upload PDF to course" });
  }
});

// Upload video to specific course
router.post("/course/:id/upload-video", upload.single("video"), async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, duration } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Video file is missing" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const videoPath = `/uploads/videos/${req.file.filename}`;

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { videos: { title: title || req.file.originalname, url: videoPath, duration: duration || 0 } } },
      { new: true }
    );

    res.status(200).json({
      message: "Video uploaded and saved to course",
      updatedCourse,
    });
  } catch (error) {
    console.error("❌ Error uploading video to course:", error);
    res.status(500).json({ error: "Failed to upload video to course" });
  }
});

module.exports = router;