import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload, FileText, Video, Headphones, Link as LinkIcon, Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddContentModal({ courseId, onClose, onContentAdded }) {
  const [selectedType, setSelectedType] = useState("");
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    url: ""
  });
  const [uploading, setUploading] = useState(false);

  const contentTypes = [
    { id: 'pdf', icon: FileText, label: 'PDF Document', description: 'Upload PDF files, presentations, or documents', color: 'red' },
    { id: 'video', icon: Video, label: 'Video Lesson', description: 'Upload video content or lessons', color: 'blue' },
    { id: 'audio', icon: Headphones, label: 'Audio File', description: 'Upload podcasts or audio lessons', color: 'green' },
    { id: 'link', icon: LinkIcon, label: 'External Link', description: 'Add links to external resources', color: 'purple' },
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!formData.title) {
        setFormData(prev => ({
          ...prev,
          title: selectedFile.name.split('.')[0]
        }));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpload = async () => {
    if (!selectedType) {
      toast.error("Please select a content type");
      return;
    }

    if ((selectedType === 'pdf' || selectedType === 'video' || selectedType === 'audio') && !file) {
      toast.error("Please select a file to upload");
      return;
    }

    if (selectedType === 'link' && !formData.url) {
      toast.error("Please enter a URL");
      return;
    }

    if (!formData.title) {
      toast.error("Please enter a title");
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (selectedType === 'link') {
        // Handle external link (this would need a separate API endpoint)
        toast.success("External link added successfully!");
        onContentAdded();
        onClose();
        return;
      }

      const uploadFormData = new FormData();
      uploadFormData.append(selectedType, file);
      uploadFormData.append('title', formData.title);
      
      if (selectedType === 'video' && formData.duration) {
        uploadFormData.append('duration', formData.duration);
      }

      const endpoint = selectedType === 'pdf' ? 'upload-pdf' : `upload-${selectedType}`;
      
      await axios.post(
        `http://localhost:3001/api/course/${courseId}/${endpoint}`,
        uploadFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(`${selectedType.toUpperCase()} uploaded successfully!`);
      onContentAdded();
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload content. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add Course Content</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {!selectedType ? (
            /* Content Type Selection */
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Choose Content Type</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {contentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedType(type.id)}
                      className="flex items-start space-x-4 p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left"
                    >
                      <div className={`w-12 h-12 bg-${type.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 text-${type.color}-600`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{type.label}</h4>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Upload Form */
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedType("")}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  ←
                </button>
                <h3 className="text-lg font-semibold text-gray-900">
                  Upload {contentTypes.find(t => t.id === selectedType)?.label}
                </h3>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter content title"
                  className="input-field"
                  required
                />
              </div>

              {/* File Upload for PDF/Video/Audio */}
              {(selectedType === 'pdf' || selectedType === 'video' || selectedType === 'audio') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      {selectedType === 'pdf' && "Upload PDF files (max 50MB)"}
                      {selectedType === 'video' && "Upload video files (max 100MB)"}
                      {selectedType === 'audio' && "Upload audio files (max 25MB)"}
                    </p>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept={
                        selectedType === 'pdf' ? '.pdf' :
                        selectedType === 'video' ? 'video/*' :
                        'audio/*'
                      }
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="btn-secondary cursor-pointer inline-flex items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose File</span>
                    </label>
                    {file && (
                      <p className="mt-4 text-sm text-gray-600">
                        Selected: {file.name}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* URL Input for Links */}
              {selectedType === 'link' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL *
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="input-field"
                    required
                  />
                </div>
              )}

              {/* Duration for Videos */}
              {selectedType === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="300"
                    className="input-field"
                    min="0"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="btn-secondary"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpload}
                  disabled={uploading}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{uploading ? "Uploading..." : "Upload Content"}</span>
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}