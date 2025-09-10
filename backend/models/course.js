const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const CourseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  pricingPlan: { 
    type: String, 
    enum: ['free', 'one-time'],  
    default: 'free' 
  },
  totalPrice: { 
    type: Number, 
    required: function () { return this.pricingPlan === 'one-time'; } 
  },
  discountedPrice: { 
    type: Number 
  },
  coverImage: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: true,
    default: 'General'
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  language: {
    type: String,
    default: 'English'
  },
  tags: [{
    type: String
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [ReviewSchema],
  pdfs: [{
    title: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  videos: [{
    title: String,
    url: String,
    duration: Number, // in seconds
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  quizzes: [{
    title: String,
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String
    }],
    passingScore: {
      type: Number,
      default: 70
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  assignments: [{
    title: String,
    description: String,
    dueDate: Date,
    maxScore: {
      type: Number,
      default: 100
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Update lastUpdated on save
CourseSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Courses', CourseSchema);