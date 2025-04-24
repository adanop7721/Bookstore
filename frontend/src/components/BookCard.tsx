import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import TextTruncate from "react-text-truncate";
import { Heart } from "lucide-react";

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
}

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const BookCard = ({
  book,
  favoriteIds,
  onToggleFavorite,
}: {
  book: Book;
  favoriteIds: string[];
  onToggleFavorite?: (bookId: string, isAdding: boolean) => void;
}) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const isFavorite = favoriteIds.includes(book.id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      setIsProcessing(true);
      if (isFavorite) {
        await axios.delete(`${SERVER_URL}/api/user/favorites/${book.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onToggleFavorite?.(book.id, false);
      } else {
        await axios.post(`${SERVER_URL}/api/user/favorites/${book.id}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onToggleFavorite?.(book.id, true);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <li>
      <Link
        to={`/book/${book.id}`}
        className="block border p-4 rounded-md shadow-sm hover:shadow-md transition duration-200 hover:bg-gray-50 relative"
      >
        <div className="absolute top-3 right-3 text-red-500">
          <button onClick={handleToggleFavorite} disabled={isProcessing}>
            <Heart
              size={16}
              strokeWidth={2}
              fill={isFavorite ? "red" : "none"}
            />
          </button>
        </div>

        <TextTruncate
          containerClassName="font-semibold text-lg text-blue-700"
          line={1}
          element="h3"
          truncateText="…"
          text={book.title}
        />
        <TextTruncate
          containerClassName="text-gray-600 text-sm"
          line={1}
          element="p"
          truncateText="…"
          text={`by ${book.author}`}
        />
        {book.description && (
          <TextTruncate
            containerClassName="text-gray-500 mt-2 text-sm"
            line={1}
            element="p"
            truncateText="…"
            text={book.description}
          />
        )}
      </Link>
    </li>
  );
};

export default BookCard;
