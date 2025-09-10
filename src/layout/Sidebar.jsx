import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  BookOpen,
  Package,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  Award,
  MessageSquare,
  Calendar,
  Library,
  UserCheck,
  Shield,
  TrendingUp,
  DollarSign,
  Globe,
  Zap,
  Target,
  Layers
} from 'lucide-react';

export default function Sidebar() {
  const [expandedSections, setExpandedSections] = useState({
    products: true,
    manage: false,
    users: false,
    reports: false
  });
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState('');
  const location = useLocation();

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    setRole(savedRole);
    setUserName(name || 'User');
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path) => location.pathname === path;
  const isParentActive = (paths) => paths.some(path => location.pathname.startsWith(path));

  if (role !== "teacher") return null;

  const menuSections = [
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      expanded: expandedSections.products,
      activePaths: ['/courses', '/packages', '/membership', '/webinar', '/digital-product', '/telegram-communities'],
      children: [
        { label: 'Courses', icon: BookOpen, path: '/courses', badge: '12' },
        { label: 'Packages', icon: Layers, path: '/packages', badge: '3' },
        { label: 'Membership', icon: Award, path: '/membership' },
        { label: 'Webinars', icon: Video, path: '/webinar', badge: '5' },
        { label: 'Digital Products', icon: FileText, path: '/digital-product' },
        { label: 'Communities', icon: Users, path: '/telegram-communities', badge: '2' }
      ]
    },
    {
      id: 'manage',
      label: 'Manage',
      icon: Settings,
      expanded: expandedSections.manage,
      activePaths: ['/asset-library', '/discussions', '/question-bank', '/quiz-reviews', '/assignments', '/live-tests', '/live-classes', '/ratings-reviews'],
      children: [
        { label: 'Asset Library', icon: Library, path: '/asset-library' },
        { label: 'Discussions', icon: MessageSquare, path: '/discussions', badge: '24' },
        { label: 'Question Bank', icon: HelpCircle, path: '/question-bank' },
        { label: 'Quiz Reviews', icon: Target, path: '/quiz-reviews' },
        { label: 'Assignments', icon: FileText, path: '/assignments', badge: '8' },
        { label: 'Live Tests', icon: Zap, path: '/live-tests' },
        { label: 'Live Classes', icon: Video, path: '/live-classes' },
        { label: 'Ratings & Reviews', icon: Award, path: '/ratings-reviews' }
      ]
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      expanded: expandedSections.users,
      activePaths: ['/learners', '/admins', '/instructors', '/affiliates', '/enquiries'],
      children: [
        { label: 'Learners', icon: Users, path: '/learners', badge: '1.2k' },
        { label: 'Admins', icon: Shield, path: '/admins' },
        { label: 'Instructors', icon: UserCheck, path: '/instructors' },
        { label: 'Affiliates', icon: Globe, path: '/affiliates' },
        { label: 'Enquiries', icon: MessageSquare, path: '/enquiries', badge: '15' }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      expanded: expandedSections.reports,
      activePaths: ['/overview', '/transactions', '/settlement', '/webinar-reports'],
      children: [
        { label: 'Overview', icon: TrendingUp, path: '/overview' },
        { label: 'Transactions', icon: DollarSign, path: '/transactions' },
        { label: 'Settlement', icon: Calendar, path: '/settlement' },
        { label: 'Webinar Reports', icon: Video, path: '/webinar-reports' }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-20 bottom-0 w-80 bg-white border-r border-gray-200 shadow-xl z-40 overflow-y-auto"
    >
      <div className="p-6">
        {/* User Profile Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-bold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-bold text-gray-900">{userName}</p>
              <p className="text-sm text-indigo-600 font-medium">Teacher Dashboard</p>
            </div>
          </div>
        </div>

        {/* Dashboard Link */}
        <div className="mb-6">
          <Link to="/home">
            <motion.div
              whileHover={{ scale: 1.02, x: 4 }}
              className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
                isActive('/home')
                  ? 'bg-indigo-100 text-indigo-700 shadow-md border border-indigo-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="font-semibold text-lg">Dashboard</span>
            </motion.div>
          </Link>
        </div>

        {/* Menu Sections */}
        <div className="space-y-4">
          {menuSections.map((section) => {
            const Icon = section.icon;
            const isExpanded = section.expanded;
            const hasActiveChild = isParentActive(section.activePaths);

            return (
              <div key={section.id}>
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                    hasActiveChild
                      ? 'bg-indigo-100 text-indigo-700 shadow-md border border-indigo-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Icon className="w-6 h-6" />
                    <span className="font-semibold text-lg">{section.label}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 ml-4 space-y-1"
                    >
                      {section.children.map((child, index) => {
                        const ChildIcon = child.icon;
                        return (
                          <Link key={index} to={child.path}>
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ scale: 1.02, x: 8 }}
                              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                                isActive(child.path)
                                  ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <ChildIcon className="w-5 h-5" />
                                <span className="font-medium">{child.label}</span>
                              </div>
                              {child.badge && (
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
                                  {child.badge}
                                </span>
                              )}
                            </motion.div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-100">
          <h4 className="font-bold text-gray-900 mb-3">Quick Stats</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Students</span>
              <span className="font-bold text-green-600">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Month Revenue</span>
              <span className="font-bold text-blue-600">₹45,230</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Course Rating</span>
              <span className="font-bold text-yellow-600">4.8 ⭐</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}