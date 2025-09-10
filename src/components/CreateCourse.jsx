import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowLeft, Upload, Image, DollarSign, Tag, Save, Eye, Globe, Users, Clock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "../layout/Sidebar";

export default function CreateCourse() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pricingPlan: "free",
    totalPrice: "",
    discountedPrice: "",
    category: "General",
    level: "Beginner",
    duration: "",
    language: "English",
    tags: ""
  });
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const categories = [
    "General", "Programming", "Design", "Business", "Marketing", 
    "Data Science", "Photography", "Music", "Language", "Health & Fitness"
  ];

  const languages = [
    "English", "Spanish", "French", "German", "Chinese", "Japanese", 
    "Portuguese", "Russian", "Arabic", "Hindi"
  ];

  useEffect(() => {
    if (isEditing) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3001/api/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const course = res.data;
      setFormData({
        title: course.title,
        description: course.description,
        pricingPlan: course.pricingPlan,
        totalPrice: course.totalPrice,
        discountedPrice: course.discountedPrice,
        category: course.category,
        level: course.level,
        duration: course.duration,
        language: course.language,
        tags: course.tags?.join(', ') || ""
      });
      
      if (course.coverImage) {
        setCoverPreview(`http://localhost:3001${course.coverImage}`);
      }
    } catch (err) {
      console.error("Failed to fetch course:", err);
      toast.error("Failed to load course data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCoverImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || (!coverImage && !isEditing)) {
      toast.error("Please fill all required fields including cover image.");
      return;
    }

    if (formData.pricingPlan === "one-time" && (!formData.totalPrice || !formData.discountedPrice)) {
      toast.error("Please enter total and discounted price for one-time plan.");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      if (coverImage) {
        formDataToSend.append("coverImage", coverImage);
      }

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:3001/api/course/${id}`, formDataToSend, config);
        toast.success("Course updated successfully!");
      } else {
        response = await axios.post("http://localhost:3001/api/courses/create", formDataToSend, config);
        toast.success("Course created successfully!");
      }

      const courseId = response.data._id || id;
      navigate(`/course-content/${courseId}`);
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Failed to save course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen pt-20">
      <Sidebar />
      
      <div className="flex-1 ml-80">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b border-gray-200 p-8 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="p-3 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </motion.button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {isEditing ? "Edit Course" : "Create New Course"}
                </h1>
                <p className="text-gray-600 mt-1 text-lg">
                  {isEditing ? "Update your course details" : "Share your knowledge with the world"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center space-x-2 shadow-md"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 shadow-lg"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{loading ? "Saving..." : "Save Course"}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-md">
                    <Tag className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Basic Information</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Enter an engaging course title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="input-field text-lg"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Course Description *
                    </label>
                    <textarea
                      name="description"
                      placeholder="Describe what students will learn in this course..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="6"
                      className="input-field resize-none text-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Difficulty Level *
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      placeholder="120"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="input-field"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Language
                    </label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      {languages.map(language => (
                        <option key={language} value={language}>{language}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      placeholder="react, javascript, web development"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Cover Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shadow-md">
                    <Image className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Cover Image *</h2>
                </div>

                <div className="space-y-4">
                  {coverPreview ? (
                    <div className="relative">
                      <img
                        src={coverPreview}
                        alt="Course cover preview"
                        className="w-full h-64 object-cover rounded-xl shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverPreview("");
                          setCoverImage(null);
                        }}
                        className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-indigo-400 transition-colors bg-gray-50">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2 text-lg font-medium">Upload a cover image for your course</p>
                      <p className="text-sm text-gray-500 mb-6 font-medium">Recommended: 1280x720px, JPG or PNG</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="cover-upload"
                      />
                      <label
                        htmlFor="cover-upload"
                        className="btn-secondary cursor-pointer inline-flex items-center space-x-2 shadow-md"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Choose Image</span>
                      </label>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Pricing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shadow-md">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Pricing</h2>
                </div>

                <div className="space-y-6">
                  {/* Free Plan */}
                  <motion.label
                    whileHover={{ scale: 1.01 }}
                    className={`block border-2 rounded-xl p-6 cursor-pointer transition-all ${
                      formData.pricingPlan === "free"
                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="radio"
                        name="pricingPlan"
                        value="free"
                        checked={formData.pricingPlan === "free"}
                        onChange={handleInputChange}
                        className="w-6 h-6 text-indigo-600"
                      />
                      <div>
                        <div className="font-bold text-xl text-gray-900">Free Course</div>
                        <div className="text-gray-600 font-medium">
                          Make your course available to everyone at no cost
                        </div>
                      </div>
                    </div>
                  </motion.label>

                  {/* Paid Plan */}
                  <motion.label
                    whileHover={{ scale: 1.01 }}
                    className={`block border-2 rounded-xl p-6 cursor-pointer transition-all ${
                      formData.pricingPlan === "one-time"
                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <input
                        type="radio"
                        name="pricingPlan"
                        value="one-time"
                        checked={formData.pricingPlan === "one-time"}
                        onChange={handleInputChange}
                        className="w-6 h-6 text-indigo-600"
                      />
                      <div>
                        <div className="font-bold text-xl text-gray-900">One-time Payment</div>
                        <div className="text-gray-600 font-medium">
                          Students pay once for lifetime access
                        </div>
                      </div>
                    </div>

                    {formData.pricingPlan === "one-time" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
                      >
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3">
                            Original Price *
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₹</span>
                            <input
                              type="number"
                              name="totalPrice"
                              value={formData.totalPrice}
                              onChange={handleInputChange}
                              className="input-field pl-10 text-lg"
                              placeholder="2999"
                              min="0"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3">
                            Discounted Price *
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₹</span>
                            <input
                              type="number"
                              name="discountedPrice"
                              value={formData.discountedPrice}
                              onChange={handleInputChange}
                              className="input-field pl-10 text-lg"
                              placeholder="1999"
                              min="0"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.label>
                </div>

                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-blue-800 text-sm font-medium">
                    💡 <strong>Tip:</strong> You can always change your pricing later. Consider starting 
                    with a lower price to attract initial students and build reviews.
                  </p>
                </div>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}