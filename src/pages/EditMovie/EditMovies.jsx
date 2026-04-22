import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditMovies = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const movies = JSON.parse(localStorage.getItem("movies")) || [];
    const movie = movies.find((m) => m.id.toString() === id);

    if (movie) {
      setTitle(movie.title);
      setPrice(movie.price);
      setImage(movie.poster_path);
    }
  }, [id]);

  // 🔥 HANDLE IMAGE UPLOAD
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 🔥 UPDATE MOVIE
  const handleUpdate = () => {
    const movies = JSON.parse(localStorage.getItem("movies")) || [];

    const updated = movies.map((m) =>
      m.id.toString() === id
        ? { ...m, title, price, poster_path: image }
        : m
    );

    localStorage.setItem("movies", JSON.stringify(updated));
    navigate("/movies");
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center text-white px-4 relative">

      {/* BACK BUTTON */}
      <div className="absolute top-6 left-6 mt-24">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-lg text-white
          border border-gray-600 hover:border-white
          bg-white/5 backdrop-blur-md
          hover:bg-white/10 transition-all duration-200"
        >
          ← Back
        </button>
      </div>

      {/* 🔥 CARD */}
      <div className="bg-[#111] p-6 rounded-xl w-full max-w-md border border-gray-800 shadow-lg">

        <h2 className="text-xl font-semibold mb-4">
          Edit Movie
        </h2>

        {/* TITLE */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Movie Title"
          className="w-full mb-3 p-3 rounded bg-black border border-gray-700 outline-none focus:ring-2 focus:ring-red-500"
        />

        {/* PRICE */}
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full mb-3 p-3 rounded bg-black border border-gray-700 outline-none focus:ring-2 focus:ring-red-500"
        />

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImage}
          className="mb-3"
        />

        {/* PREVIEW */}
        {image && (
          <div className="relative mb-4">
            <img
              src={image}
              alt="preview"
              className="w-full h-[180px] object-cover rounded-lg"
            />

            {/* DELETE IMAGE */}
            <button
              onClick={() => setImage("")}
              className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full text-xs hover:bg-black"
            >
              ✕
            </button>
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleUpdate}
          className="w-full bg-red-600 py-3 rounded-lg font-semibold 
          hover:bg-red-700 transition 
          shadow-[0_0_20px_rgba(220,38,38,0.6)] 
          hover:shadow-[0_0_30px_rgba(220,38,38,0.9)]"
        >
          Update Movie
        </button>

      </div>

    </div>
  );
};

export default EditMovies;