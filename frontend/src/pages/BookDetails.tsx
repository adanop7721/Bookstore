import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

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
  const [isProcessing, setIsProcessing] = useState(false);

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

  const isFavorite = favorites.some((fav) => fav.id === id);

  const handleToggleFavorite = async () => {
    if (!token || !id) return navigate("/login");

    setIsProcessing(true);
    try {
      if (isFavorite) {
        await axios.delete(`${SERVER_URL}/api/user/favorites/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites((prev) => prev.filter((b) => b.id !== id));
        toast.info("Removed from favorites");
      } else {
        await axios.post(`${SERVER_URL}/api/user/favorites/${id}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (book) setFavorites((prev) => [...prev, book]);
        toast.success("Added to favorites");
      }
    } catch (err) {
      console.error("Favorite toggle failed:", err);
      toast.error("Failed to update favorite");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
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
        onClick={handleToggleFavorite}
        disabled={isProcessing}
        className={`px-4 py-2 rounded text-white ${
          isFavorite
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
    </div>
  );
};

export default BookDetails;
