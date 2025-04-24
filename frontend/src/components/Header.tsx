import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import CloseIcon from "../assets/icons/CloseIcon";
import MenuIcon from "../assets/icons/MenuIcon";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow px-6 py-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-700">
          📚 Bookstore
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="xs:hidden text-gray-700"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden xs:flex  space-x-4">
          <Link to="/favorites" className="text-gray-700 hover:text-blue-700">
            Favorites
          </Link>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-700">
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="xs:hidden mt-4 flex flex-col gap-2">
          <Link
            to="/favorites"
            className="text-gray-700 hover:text-blue-700"
            onClick={() => setMenuOpen(false)}
          >
            Favorites
          </Link>
          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="text-red-600 hover:underline text-left"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-700"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-blue-700"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
