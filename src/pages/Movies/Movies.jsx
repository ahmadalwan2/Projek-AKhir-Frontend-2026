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

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    setUser(currentUser);

    console.log("IMG_URL:", IMG_URL); // 🔥 DEBUG
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
        poster_path: m.poster_path
          ? `${IMG_URL}${m.poster_path}`
          : "https://via.placeholder.com/300x450",
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
      console.error("ERROR FETCH:", err);
    }
  };

  const handleDelete = (id) => {
    const updated = movies.filter((m) => m.id !== id);
    setMovies(updated);

    const localMovies =
      JSON.parse(localStorage.getItem("movies")) || [];

    const filtered = localMovies.filter((m) => m.id !== id);
    localStorage.setItem("movies", JSON.stringify(filtered));
  };

  const openBuyModal = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

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
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x450";
                    }}
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
                              className="bg-green-600 px-2 py-1 text-xs rounded"
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

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-xl text-center">
            <h2 className="mb-4">Konfirmasi Pembelian</h2>

            <p className="mb-4">
              Beli <b>{selectedMovie?.title}</b>?
            </p>

            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={confirmBuy}>Buy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;