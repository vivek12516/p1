import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './layout/Navbar';
import Landingpage from './components/Landingpage';
import Signup from './components/Signup';
import Signin from './components/Login';
import Courses from './components/Courses';
import Home from "./components/Home";
import CreateCourse from './components/CreateCourse';
import CourseContent from './components/CourseContent';
import CoursePreview from './components/CoursePreview';
import Analytics from './components/Analytics';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/courses" element={<Courses />} />

        {/* Protected Routes for Teacher Only */}
        <Route
          path="/courses/create"
          element={
            <ProtectedRoute role="teacher">
              <CreateCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/edit/:id"
          element={
            <ProtectedRoute role="teacher">
              <CreateCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute role="teacher">
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route path="/course-content/:courseId" element={<CourseContent />} />
        <Route path="/courses/preview/:id" element={<CoursePreview />} />
      </Routes>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;