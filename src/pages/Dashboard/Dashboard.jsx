import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMG_URL = import.meta.env.VITE_TMDB_IMG_URL;

const Dashboard = () => {
  const navigate = useNavigate();

  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);

  // 🔥 ambil user login
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const featuredRef = useRef(null);
  const trendingRef = useRef(null);

  const [canScrollLeftF, setCanScrollLeftF] = useState(false);
  const [canScrollRightF, setCanScrollRightF] = useState(true);

  const [canScrollLeftT, setCanScrollLeftT] = useState(false);
  const [canScrollRightT, setCanScrollRightT] = useState(true);

  useEffect(() => {
    getMovies();
  }, []);

  const getMovies = async () => {
    try {
      const res1 = await axios.get(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}`
      );
      setFeatured(res1.data.results);

      const res2 = await axios.get(
        `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
      );
      setTrending(res2.data.results);
    } catch (err) {
      console.error(err);
    }
  };

  const getPrice = () => {
    return (Math.random() * 10 + 1).toFixed(2);
  };

  const checkScroll = (ref, setLeft, setRight) => {
    const el = ref.current;
    if (!el) return;

    setLeft(el.scrollLeft > 0);
    setRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (ref, direction, setLeft, setRight) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });

      setTimeout(() => {
        checkScroll(ref, setLeft, setRight);
      }, 300);
    }
  };

  useEffect(() => {
    const el = featuredRef.current;
    if (!el) return;

    const handleScroll = () =>
      checkScroll(featuredRef, setCanScrollLeftF, setCanScrollRightF);

    el.addEventListener("scroll", handleScroll);
    checkScroll(featuredRef, setCanScrollLeftF, setCanScrollRightF);

    return () => el.removeEventListener("scroll", handleScroll);
  }, [featured]);

  useEffect(() => {
    const el = trendingRef.current;
    if (!el) return;

    const handleScroll = () =>
      checkScroll(trendingRef, setCanScrollLeftT, setCanScrollRightT);

    el.addEventListener("scroll", handleScroll);
    checkScroll(trendingRef, setCanScrollLeftT, setCanScrollRightT);

    return () => el.removeEventListener("scroll", handleScroll);
  }, [trending]);

  return (
    <div className="bg-black text-white min-h-screen pt-24 px-6">

      {/* HERO */}
      <div className="text-center mt-24 mb-14">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Discover Your <br /> Favorite Movies
        </h1>

        <p className="text-gray-400 max-w-xl mx-auto mb-6">
          Explore, organize and track the films you love.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/movies")}
            className="bg-red-600 px-6 py-2 rounded-[8px] 
            hover:bg-red-700 text-white text-lg transition-all duration-200
            shadow-[0_0_10px_rgba(220,38,38,0.6)]"
          >
            Browse Movies
          </button>

          {/* 🔥 hanya admin */}
          {isAdmin && (
            <button
              onClick={() => navigate("/add-movie")}
              className="px-6 py-2 rounded-[8px] text-lg text-white
              border border-gray-600 hover:border-white
              bg-white/5 backdrop-blur-md
              hover:bg-white/10 transition-all duration-200"
            >
              Add Movie
            </button>
          )}
        </div>
      </div>

      {/* FEATURED */}
      <section className="mb-12 relative">
        <h2 className="text-xl font-semibold mb-4">Featured</h2>

        {canScrollLeftF && (
          <button
            onClick={() =>
              scroll(featuredRef, "left", setCanScrollLeftF, setCanScrollRightF)
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 
            bg-white/90 text-black p-2 rounded-full shadow"
          >
            <FaChevronLeft size={16} />
          </button>
        )}

        {canScrollRightF && (
          <button
            onClick={() =>
              scroll(featuredRef, "right", setCanScrollLeftF, setCanScrollRightF)
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 
            bg-white/90 text-black p-2 rounded-full shadow"
          >
            <FaChevronRight size={16} />
          </button>
        )}

        <div ref={featuredRef} className="flex gap-4 overflow-x-auto pb-2">
          {featured.map((movie) => (
            <div
              key={movie.id}
              className="group min-w-[180px] cursor-pointer 
              transition duration-300 hover:scale-105"
            >
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={IMG_URL + movie.poster_path}
                  alt={movie.title}
                  className="w-full h-[300px] object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

                <div className="absolute bottom-2 left-2 right-2 z-10">
                  <p className="text-sm font-semibold line-clamp-1">
                    {movie.title}
                  </p>
                  <p className="text-red-500 text-xs font-bold">
                    ${getPrice()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="relative">
        <h2 className="text-xl font-semibold mb-4">Trending Now</h2>

        <div ref={trendingRef} className="flex gap-4 overflow-x-auto pb-2">
          {trending.map((movie) => (
            <div
              key={movie.id}
              className="group min-w-[180px] cursor-pointer 
              transition duration-300 hover:scale-105"
            >
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={IMG_URL + movie.poster_path}
                  alt={movie.title}
                  className="w-full h-[260px] object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

                <div className="absolute bottom-2 left-2 right-2 z-10">
                  <p className="text-sm font-semibold line-clamp-1">
                    {movie.title}
                  </p>
                  <p className="text-red-500 text-xs font-bold">
                    ${getPrice()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <div className="mt-16 border-t border-gray-800 pt-10 pb-10 text-sm text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p>Flixy Film © 2026</p>

          <div className="flex gap-6">
            <Link to="/dashboard" className="hover:text-white">Home</Link>
            <Link to="/movies" className="hover:text-white">Movies</Link>

            {/* 🔥 hanya admin */}
            {isAdmin && (
              <>
                <Link to="/add-movie" className="hover:text-white">
                  Add Movie
                </Link>
                <Link to="/admin" className="hover:text-white">
                  Admin
                </Link>
              </>
            )}

            <Link to="/profile" className="hover:text-white">Profile</Link>
          </div>

          <p>Built with ❤️ by Flixy</p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;