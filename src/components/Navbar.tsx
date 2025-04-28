// components/Navbar.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
}

interface NavbarProps {
  categories: Category[];
}

const Navbar = ({ categories }: NavbarProps) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link to="/home" className="text-xl font-semibold">Catalogue</Link>
            
            <div className="hidden md:flex space-x-4">
              <Link to="/home" className="px-3 py-2 rounded-md hover:bg-gray-100">Home</Link>
              <Link to="/category/all" className="px-3 py-2 rounded-md hover:bg-gray-100">All Products</Link>
              {categories.map(category => (
                <Link 
                  key={category.id} 
                  to={`/category/${category.id}`}
                  className="px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
            >
              <span className="text-gray-600">
                {/* You can replace this with user initials or profile image */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;