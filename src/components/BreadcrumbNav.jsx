import React from 'react';
import { useLocation } from 'react-router-dom';

const BreadcrumbNav = () => {
  const location = useLocation();
  let currentPage = 'Home'; // Default page name

  // Determine page name based on the path
  switch (location.pathname) {
    case '/':
      currentPage = 'Home';
      break;
    case '/programs':
      currentPage = 'Programs';
      break;
    case '/events':
      currentPage = 'Events';
      break;
    case '/memberships':
      currentPage = 'Memberships';
      break;
    case '/documents':
      currentPage = 'Documents';
      break;
    case '/people':
      currentPage = 'People';
      break;
    default:
      // Handle potential unknown paths or dynamic routes if needed
      currentPage = 'Page';
  }

  return (
    <div className="bg-gray-100 p-4 border-b border-gray-200">
      <h1 className="text-xl font-semibold text-gray-800">{currentPage}</h1>
    </div>
  );
};

export default BreadcrumbNav;