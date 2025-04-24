import { useEffect, useState } from "react";
import axios from "axios";
import BookCard, { Book } from "../components/BookCard";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${SERVER_URL}/api/books`, {
          params: { page, limit: 10, search },
        });
        setBooks(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, search]);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📚 Online Bookstore</h1>
      <input
        type="text"
        placeholder="Search by title or author"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="w-full mb-6 p-2 border border-gray-300 rounded-md"
      />

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </ul>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="self-center">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
