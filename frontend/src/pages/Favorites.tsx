import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import BookCard, { Book } from "../components/BookCard";
import { Loader } from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
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
        setFavoriteIds(res.data.map((book: Book) => book.id));
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  const handleToggleFavorite = (bookId: string, isAdding: boolean) => {
    if (!isAdding) {
      setFavorites((prev) => prev.filter((b) => b.id !== bookId));
      setFavoriteIds((prev) => prev.filter((id) => id !== bookId));
    }

    if (isAdding) {
      toast.success("Added to favorites");
    } else {
      toast.info("Removed from favorites");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );

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
            <BookCard
              key={book.id}
              book={book}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
