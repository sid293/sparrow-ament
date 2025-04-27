import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaUsers, FaIdCard, FaFileAlt, FaUserFriends, FaBell, FaSearch } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: FaHome, text: 'Home', path: '/' },
    { icon: FaCalendarAlt, text: 'Programs', path: '/programs' },
    { icon: FaUsers, text: 'Events', path: '/events' },
    { icon: FaIdCard, text: 'Memberships', path: '/memberships' },
    { icon: FaFileAlt, text: 'Documents', path: '/documents' },
    { icon: FaUserFriends, text: 'People', path: '/people' },
  ];

  return (
    <div className="h-screen lg:w-64 flex-shrink-0">
      {/* Sidebar */}
      <div className={`fixed lg:static lg:translate-x-0 inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition duration-200 ease-in-out bg-white shadow-lg w-64 h-full space-y-6 py-7 px-2 z-30`}>
        <div className="flex items-center justify-between px-4">
          <span className="text-2xl font-semibold">Sparrow</span>
          <button onClick={() => setIsOpen(false)} className="lg:hidden">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors duration-200"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.text}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center space-x-3 px-4 py-2.5 text-gray-700">
            <FaBell className="h-5 w-5" />
            <span>Notifications</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-2.5 text-gray-700">
            <FaSearch className="h-5 w-5" />
            <span>Search</span>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setIsOpen(true)}
          className={`${isOpen ? 'hidden' : 'block'} p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white`}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 lg:p-8">
        {/* Your page content goes here */}
      </div>
    </div>
  );
};

export default Navbar;