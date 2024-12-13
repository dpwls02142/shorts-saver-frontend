import React from 'react';
import { Link } from 'react-router-dom';
import { Home, PlusCircle } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <Home className="mr-2" /> Youtube Shorts 저장소
        </Link>
        <div className="flex space-x-4">
          <Link 
            to="/add" 
            className="bg-white text-blue-600 px-4 py-2 rounded-full 
                       hover:bg-blue-100 transition flex items-center"
          >
            <PlusCircle className="mr-2" /> 추가하기
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;