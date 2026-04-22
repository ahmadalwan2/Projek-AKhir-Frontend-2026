import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMG_URL = import.meta.env.VITE_TMDB_IMG_URL;

const Movies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);

  // 🔥 MODAL STATE
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    setUser(currentUser);
    getMovies();
  }, []);

  const getMovies = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}`
      );

      const apiMovies = res.data.results.map((m) => ({
        id: m.id,
        title: m.title,
        poster_path: IMG_URL + m.poster_path,
        price: (Math.random() * 5 + 3).toFixed(2),
        isApi: true,
      }));

      const localMovies =
        JSON.parse(localStorage.getItem("movies")) || [];

      const localWithFlag = localMovies.map((m) => ({
        ...m,
        isApi: false,
        price: m.price || (Math.random() * 5 + 3).toFixed(2),
      }));

      setMovies([...localWithFlag, ...apiMovies]);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 DELETE (ADMIN)
  const handleDelete = (id) => {
    const updated = movies.filter((m) => m.id !== id);
    setMovies(updated);

    const localMovies =
      JSON.parse(localStorage.getItem("movies")) || [];

    const filtered = localMovies.filter((m) => m.id !== id);
    localStorage.setItem("movies", JSON.stringify(filtered));
  };

  // 🔥 OPEN MODAL
  const openBuyModal = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  // 🔥 CONFIRM BUY
  const confirmBuy = () => {
    const requests =
      JSON.parse(localStorage.getItem("requests")) || [];

    const newRequest = {
      id: Date.now(),
      movieId: selectedMovie.id,
      movieTitle: selectedMovie.title,
      price: selectedMovie.price,
      user: user?.email,
      status: "pending",
    };

    localStorage.setItem(
      "requests",
      JSON.stringify([newRequest, ...requests])
    );

    setShowModal(false);
    setSelectedMovie(null);
  };

  // 🔥 CHECK STATUS
  const getStatus = (movieId) => {
    const requests =
      JSON.parse(localStorage.getItem("requests")) || [];

    const found = requests.find(
      (r) =>
        r.movieId === movieId &&
        r.user === user?.email
    );

    return found?.status || null;
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">

      {/* CONTENT */}
      <div className="flex-grow px-6 pt-24">
        <h1 className="text-2xl font-bold mb-6">All Movies</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie) => {
            const status = getStatus(movie.id);

            return (
              <div key={movie.id} className="hover:scale-105 transition">
                <div className="relative rounded-xl overflow-hidden">

                  <img
                    src={movie.poster_path}
                    alt={movie.title}
                    className="w-full h-[300px] object-cover"
                  />

                  <div className="absolute bottom-0 p-2 w-full bg-gradient-to-t from-black">

                    <p className="text-xs font-semibold">
                      {movie.title}
                    </p>

                    <p className="text-red-500 text-xs">
                      ${movie.price}
                    </p>

                    <div className="flex gap-2 mt-2">

                      {/* ADMIN */}
                      {user?.role === "admin" && (
                        <>
                          <button
                            onClick={() =>
                              navigate(`/edit/${movie.id}`)
                            }
                            className="bg-white text-black px-2 py-1 text-xs rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(movie.id)}
                            className="bg-red-600 px-2 py-1 text-xs rounded"
                          >
                            Delete
                          </button>
                        </>
                      )}

                      {/* USER */}
                      {user?.role === "user" && (
                        <>
                          {status === "pending" && (
                            <span className="text-yellow-400 text-xs">
                              Pending...
                            </span>
                          )}

                          {status === "approved" && (
                            <span className="text-green-400 text-xs">
                              Purchased
                            </span>
                          )}

                          {!status && (
                            <button
                              onClick={() => openBuyModal(movie)}
                              className="bg-green-600 px-2 py-1 text-xs rounded hover:bg-green-700"
                            >
                              Buy
                            </button>
                          )}
                        </>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-[#111] border border-gray-800 p-6 rounded-xl w-[320px] text-center shadow-xl animate-fadeIn">

            <h2 className="text-lg font-semibold mb-2">
              Konfirmasi Pembelian
            </h2>

            <p className="text-gray-400 text-sm mb-4">
              Yakin mau beli <span className="text-white font-semibold">{selectedMovie?.title}</span>?
            </p>

            <div className="flex gap-3 justify-center">

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={confirmBuy}
                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700"
              >
                Yes, Buy
              </button>

            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-gray-800 py-8 text-sm text-gray-500 mt-16">
        <div className="flex justify-between items-center flex-wrap gap-4 p-6">
          <p>Flixy Film © 2026</p>

          <div className="flex gap-6">
            <Link to="/dashboard">Home</Link>
            <Link to="/movies">Movies</Link>

            {/* 🔥 HANYA ADMIN */}
            {user?.role === "admin" && (
              <>
                <Link to="/add-movie">Add Movie</Link>
                <Link to="/admin">Admin</Link>
              </>
            )}

            <Link to="/profile">Profile</Link>
          </div>

          <p>Built with ❤️ by Flixy</p>
        </div>
      </footer>
    </div>
  );
};

export default Movies;