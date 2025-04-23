import { useEffect, useState } from "react";
import axios from "axios";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    axios.get("/api/user/favorites").then((res) => setFavorites(res.data));
  }, []);

  return (
    <div>
      <h2>Your Favorite Books</h2>
      <ul>
        {favorites.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
