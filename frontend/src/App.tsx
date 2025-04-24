import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BookDetails from "./pages/BookDetails";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="h-screen w-screen flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
