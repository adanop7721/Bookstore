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
  const [loading, setLoading] = useState(true);
  const [favoriteSuccess, setFavoriteSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${SERVER_URL}/api/books/${id}`)
      .then((res) => setBook(res.data))
      .catch((err) => console.error("Failed to fetch book:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login to add favorites.");

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
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add to Favorites
      </button>

      {favoriteSuccess && (
        <p className="text-green-600 mt-2">Book added to favorites!</p>
      )}
    </div>
  );
};

export default BookDetails;
