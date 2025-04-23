import { Link } from "react-router-dom";

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
}

const BookCard = ({ book }: { book: Book }) => {
  return (
    <li className="border p-4 rounded-md shadow-sm">
      <Link
        to={`/book/${book.id}`}
        className="block font-semibold text-lg text-blue-700 hover:underline"
      >
        {book.title}
      </Link>
      <p className="text-gray-600 text-sm">by {book.author}</p>
      {book.description && (
        <p className="text-gray-500 mt-2 text-sm">
          {book.description.substring(0, 100)}...
        </p>
      )}
    </li>
  );
};

export default BookCard;
