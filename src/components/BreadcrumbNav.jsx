import React from 'react';
import { useLocation } from 'react-router-dom';

const BreadcrumbNav = () => {
  const location = useLocation();
  let currentPage = 'Home'; 

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
      currentPage = 'Page';
  }

  return (
    <div className="bg-gray-100 p-4 border-b border-gray-200">
      <h1 className="text-xl font-semibold text-gray-800">{currentPage}</h1>
    </div>
  );
};

export default BreadcrumbNav;