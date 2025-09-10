import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Home,
  GraduationCap,
  BarChart3,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Plus,
  Award,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    
    setIsLoggedIn(!!token);
    setUserRole(role || '');
    setUserName(name || '');
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
    
    setIsLoggedIn(false);
    setUserRole('');
    setUserName('');
    setUserMenuOpen(false);
    
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path) => location.pathname === path;
  const isCoursesActive = location.pathname.startsWith('/courses');

  const publicNavItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Courses', path: '/courses', icon: BookOpen },
  ];

  const studentNavItems = [
    { label: 'Dashboard', path: '/home', icon: Home },
    { label: 'My Courses', path: '/courses', icon: BookOpen },
    { label: 'Certificates', path: '/certificates', icon: Award },
  ];

  const teacherNavItems = [
    { label: 'Dashboard', path: '/home', icon: Home },
    { label: 'My Courses', path: '/courses', icon: BookOpen },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  const getNavItems = () => {
    if (!isLoggedIn) return publicNavItems;
    return userRole === 'teacher' ? teacherNavItems : studentNavItems;
  };

  const notifications = [
    { id: 1, title: 'New course enrollment', message: 'Sarah enrolled in React Masterclass', time: '2 min ago', unread: true },
    { id: 2, title: 'Assignment submitted', message: 'John submitted JavaScript basics assignment', time: '1 hour ago', unread: true },
    { id: 3, title: 'Course completed', message: 'Emma completed Python fundamentals', time: '3 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Don't show navbar on landing page for non-logged-in users
  if (!isLoggedIn && location.pathname === '/') {
    return null;
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={isLoggedIn ? '/home' : '/'}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Learnova
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {getNavItems().map((item) => {
                const Icon = item.icon;
                const active = item.path === '/courses' ? isCoursesActive : isActive(item.path);
                
                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                        active
                          ? 'bg-indigo-100 text-indigo-700 shadow-md'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Search Bar (for logged-in users) */}
            {isLoggedIn && (
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <form onSubmit={handleSearch} className="relative w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
                  />
                </form>
              </div>
            )}

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  {/* Create Course Button (Teachers only) */}
                  {userRole === 'teacher' && (
                    <Link to="/courses/create">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create</span>
                      </motion.button>
                    </Link>
                  )}

                  {/* Notifications */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                      className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                    >
                      <Bell className="w-6 h-6" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </motion.button>

                    <AnimatePresence>
                      {notificationsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 py-4 z-50"
                        >
                          <div className="px-4 pb-2 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Notifications</h3>
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                                  notification.unread ? 'bg-blue-50' : ''
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className={`w-2 h-2 rounded-full mt-2 ${
                                    notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                                  }`}></div>
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-900 text-sm">
                                      {notification.title}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                      {notification.message}
                                    </p>
                                    <p className="text-gray-400 text-xs mt-1">
                                      {notification.time}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="px-4 pt-2 border-t border-gray-100">
                            <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">
                              View all notifications
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* User Menu */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-all"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-bold">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="font-semibold text-gray-900 text-sm">{userName}</p>
                        <p className="text-gray-600 text-xs capitalize">{userRole}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </motion.button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50"
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="font-bold text-gray-900">{userName}</p>
                            <p className="text-gray-600 text-sm capitalize">{userRole} Account</p>
                          </div>
                          
                          <div className="py-2">
                            <Link to="/profile" onClick={() => setUserMenuOpen(false)}>
                              <div className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                                <User className="w-5 h-5 text-gray-600" />
                                <span className="font-medium text-gray-900">Profile</span>
                              </div>
                            </Link>
                            
                            <Link to="/settings" onClick={() => setUserMenuOpen(false)}>
                              <div className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                                <Settings className="w-5 h-5 text-gray-600" />
                                <span className="font-medium text-gray-900">Settings</span>
                              </div>
                            </Link>

                            {userRole === 'teacher' && (
                              <Link to="/analytics" onClick={() => setUserMenuOpen(false)}>
                                <div className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                                  <BarChart3 className="w-5 h-5 text-gray-600" />
                                  <span className="font-medium text-gray-900">Analytics</span>
                                </div>
                              </Link>
                            )}
                          </div>

                          <div className="border-t border-gray-100 py-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left"
                            >
                              <LogOut className="w-5 h-5 text-red-600" />
                              <span className="font-medium text-red-600">Sign Out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                /* Not logged in */
                <div className="flex items-center space-x-4">
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-ghost"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                  <Link to="/signup">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary"
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Search */}
                {isLoggedIn && (
                  <form onSubmit={handleSearch} className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search courses..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
                    />
                  </form>
                )}

                {/* Mobile Navigation Items */}
                {getNavItems().map((item) => {
                  const Icon = item.icon;
                  const active = item.path === '/courses' ? isCoursesActive : isActive(item.path);
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02, x: 4 }}
                        className={`flex items-center space-x-3 p-4 rounded-xl font-semibold transition-all ${
                          active
                            ? 'bg-indigo-100 text-indigo-700 shadow-md'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}

                {/* Mobile Create Course Button (Teachers only) */}
                {isLoggedIn && userRole === 'teacher' && (
                  <Link to="/courses/create" onClick={() => setIsOpen(false)}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Create Course</span>
                    </motion.div>
                  </Link>
                )}

                {/* Mobile Auth Buttons */}
                {!isLoggedIn && (
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="w-full btn-ghost text-left"
                      >
                        Sign In
                      </motion.button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="w-full btn-primary"
                      >
                        Get Started
                      </motion.button>
                    </Link>
                  </div>
                )}

                {/* Mobile Logout */}
                {isLoggedIn && (
                  <div className="pt-4 border-t border-gray-200">
                    <motion.button
                      whileHover={{ scale: 1.02, x: 4 }}
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 p-4 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-all w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-20"></div>

      {/* Click outside handlers */}
      {(userMenuOpen || notificationsOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setUserMenuOpen(false);
            setNotificationsOpen(false);
          }}
        />
      )}
    </>
  );
}