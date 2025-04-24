import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
}

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteSuccess, setFavoriteSuccess] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!id) return;

    const fetchBookAndFavorites = async () => {
      try {
        const [bookRes, favRes] = await Promise.all([
          axios.get(`${SERVER_URL}/api/books/${id}`),
          token
            ? axios.get(`${SERVER_URL}/api/user/favorites`, {
                headers: { Authorization: `Bearer ${token}` },
              })
            : Promise.resolve({ data: [] }),
        ]);

        setBook(bookRes.data);
        setFavorites(favRes.data);
      } catch (err) {
        console.error("Failed to load book or favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndFavorites();
  }, [id, token]);

  const isAlreadyFavorite = favorites.some((fav) => fav.id === id);

  const handleAddToFavorites = async () => {
    try {
      if (!token) return navigate("/login");

      await axios.post(`${SERVER_URL}/api/user/favorites/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavoriteSuccess(true);
    } catch (err) {
      console.error("Failed to add to favorites:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!book) return <div>Book not found.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-4 block"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
      <p className="text-gray-700 mb-2">Author: {book.author}</p>
      <p className="text-gray-600 mb-4">{book.description}</p>

      <button
        onClick={handleAddToFavorites}
        disabled={isAlreadyFavorite}
        className={`px-4 py-2 rounded text-white ${
          isAlreadyFavorite
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isAlreadyFavorite ? "Already in Favorites" : "Add to Favorites"}
      </button>

      {favoriteSuccess && !isAlreadyFavorite && (
        <p className="text-green-600 mt-2">Book added to favorites!</p>
      )}
    </div>
  );
};

export default BookDetails;
