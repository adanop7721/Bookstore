import { Link } from "react-router-dom";
import TextTruncate from "react-text-truncate";

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
}

const BookCard = ({ book }: { book: Book }) => {
  return (
    <li>
      <Link
        to={`/book/${book.id}`}
        className="block border p-4 rounded-md shadow-sm hover:shadow-md transition duration-200 hover:bg-gray-50"
      >
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
