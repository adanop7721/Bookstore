import { Link } from "react-router-dom";

const Header = () => (
  <nav className="bg-white p-4">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-xl font-bold">📚 Bookstore</h1>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>
        <Link to="/favorites" className="text-gray-700 hover:text-blue-600">
          Favorites
        </Link>
        <Link to="/login" className="text-gray-700 hover:text-blue-600">
          Login
        </Link>
        <Link to="/register" className="text-gray-700 hover:text-blue-600">
          Register
        </Link>
      </div>
    </div>
  </nav>
);

export default Header;
