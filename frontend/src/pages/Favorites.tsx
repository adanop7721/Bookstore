import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BookCard, { Book } from "../components/BookCard";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`${SERVER_URL}/api/user/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFavorites(res.data);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  if (loading) return <div className="p-6">Loading favorites...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Favorite Books</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-600">
          You haven’t added any favorite books yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {favorites.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
