import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Video, 
  Headphones, 
  Link as LinkIcon,
  BookOpen,
  Eye,
  Settings,
  Upload,
  Play,
  Edit,
  Trash2,
  Clock,
  Users,
  Star,
  Globe
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import AddContentModal from "./AddContentModal";

export default function CourseContent() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3001/api/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourse(res.data);
    } catch (err) {
      console.error("Error fetching course:", err);
      toast.error("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3001/api/course/${courseId}/publish`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(`Course ${course.isPublished ? 'unpublished' : 'published'} successfully`);
      fetchCourse();
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("Failed to update course status");
    }
  };

  const contentTypes = [
    { 
      icon: FileText, 
      label: "PDF Documents", 
      count: course?.pdfs?.length || 0, 
      color: "red",
      description: "Reading materials and resources"
    },
    { 
      icon: Video, 
      label: "Video Lessons", 
      count: course?.videos?.length || 0, 
      color: "blue",
      description: "Interactive video content"
    },
    { 
      icon: Headphones, 
      label: "Audio Files", 
      count: 0, 
      color: "green",
      description: "Podcasts and audio lessons"
    },
    { 
      icon: LinkIcon, 
      label: "External Links", 
      count: 0, 
      color: "purple",
      description: "Additional resources and references"
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 p-8 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
                {course?.title || "Course Content"}
              </h1>
              <p className="text-gray-600 mt-1 text-lg">Manage your course materials and structure</p>
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
              onClick={handlePublishToggle}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${
                course?.isPublished 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>{course?.isPublished ? 'Unpublish' : 'Publish'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary flex items-center space-x-2 shadow-md"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-28 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Course Overview</h3>
              
              {/* Course Cover */}
              <div className="mb-6">
                {course?.coverImage ? (
                  <img
                    src={`http://localhost:3001${course.coverImage}`}
                    alt="Course cover"
                    className="w-full h-32 object-cover rounded-xl shadow-md"
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center shadow-md">
                    <BookOpen className="w-12 h-12 text-indigo-400" />
                  </div>
                )}
              </div>

              {/* Course Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Students</span>
                  </div>
                  <span className="font-bold text-gray-900">{course?.enrolledStudents?.length || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">Rating</span>
                  </div>
                  <span className="font-bold text-gray-900">{course?.rating?.toFixed(1) || '0.0'}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Duration</span>
                  </div>
                  <span className="font-bold text-gray-900">{course?.duration || 0}min</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Status</span>
                  </div>
                  <span className={`font-bold ${course?.isPublished ? 'text-green-600' : 'text-orange-600'}`}>
                    {course?.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Content Stats */}
              <div className="space-y-3">
                {contentTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-${type.color}-100 rounded-xl flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 text-${type.color}-600`} />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-700">{type.label}</span>
                          <p className="text-xs text-gray-500">{type.description}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-lg">{type.count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                    Reorder Content
                  </button>
                  <button className="w-full text-left p-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                    Bulk Upload
                  </button>
                  <button className="w-full text-left p-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                    Import from Library
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'content'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Course Content
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'students'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Students ({course?.enrolledStudents?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'reviews'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Reviews ({course?.reviews?.length || 0})
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'content' && (
              <>
                {/* Empty State or Content List */}
                {(!course?.pdfs || course.pdfs.length === 0) && (!course?.videos || course.videos.length === 0) ? (
                  <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="w-12 h-12 text-indigo-500" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Start Building Your Course</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                      Add your first piece of content to get started. You can upload videos, PDFs, 
                      audio files, or create interactive content.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowModal(true)}
                        className="flex items-center justify-center space-x-2 p-6 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all shadow-md"
                      >
                        <Upload className="w-5 h-5" />
                        <span className="font-semibold">Upload Content</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center space-x-2 p-6 border-2 border-dashed border-purple-300 text-purple-600 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all shadow-md"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="font-semibold">Create Content</span>
                      </motion.button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowModal(true)}
                      className="btn-primary shadow-lg"
                    >
                      Add Your First Content
                    </motion.button>
                  </div>
                ) : (
                  /* Content List */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-bold text-gray-900">Course Content</h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowModal(true)}
                        className="btn-primary flex items-center space-x-2 shadow-lg"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Content</span>
                      </motion.button>
                    </div>

                    {/* PDF List */}
                    {course?.pdfs && course.pdfs.length > 0 && (
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                          <FileText className="w-6 h-6 text-red-600" />
                          <span>Documents</span>
                        </h3>
                        <div className="space-y-3">
                          {course.pdfs.map((pdf, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shadow-md">
                                  <FileText className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 text-lg">
                                    {pdf.title || `Chapter ${index + 1}`}
                                  </p>
                                  <p className="text-sm text-gray-500 font-medium">PDF Document</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => window.open(`http://localhost:3001${pdf.url}`, "_blank")}
                                  className="p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm"
                                >
                                  <Play className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-xl transition-all shadow-sm"
                                >
                                  <Edit className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Video List */}
                    {course?.videos && course.videos.length > 0 && (
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                          <Video className="w-6 h-6 text-blue-600" />
                          <span>Video Lessons</span>
                        </h3>
                        <div className="space-y-3">
                          {course.videos.map((video, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-md">
                                  <Video className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 text-lg">
                                    {video.title || `Lesson ${index + 1}`}
                                  </p>
                                  <p className="text-sm text-gray-500 font-medium">
                                    Video • {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => window.open(`http://localhost:3001${video.url}`, "_blank")}
                                  className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
                                >
                                  <Play className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-xl transition-all shadow-sm"
                                >
                                  <Edit className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Enrolled Students</h3>
                {course?.enrolledStudents?.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No students enrolled yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Student list would go here */}
                    <p className="text-gray-600">Student management coming soon...</p>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Course Reviews</h3>
                {course?.reviews?.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {course?.reviews?.map((review, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            by {review.user?.username || 'Anonymous'}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Add Content Modal */}
      {showModal && (
        <AddContentModal 
          courseId={courseId}
          onClose={() => setShowModal(false)} 
          onContentAdded={fetchCourse}
        />
      )}
    </div>
  );
}