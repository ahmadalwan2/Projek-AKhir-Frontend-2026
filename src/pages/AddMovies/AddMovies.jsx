import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const AddMovies = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  // 🔥 COMPRESS IMAGE
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxWidth = 300; // 🔥 kecilin ukuran
        const scale = maxWidth / img.width;

        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 🔥 convert ke JPG + compress
        resolve(canvas.toDataURL("image/jpeg", 0.6));
      };

      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !image) {
      alert("Isi semua field dulu!");
      return;
    }

    // ✅ VALIDASI
    if (!["image/png", "image/jpeg", "image/jpg"].includes(image.type)) {
      alert("File harus PNG / JPG!");
      return;
    }

    if (image.size > 4 * 1024 * 1024) {
      alert("Maksimal 4MB!");
      return;
    }

    try {
      // 🔥 COMPRESS DULU
      const compressed = await compressImage(image);

      const newMovie = {
        id: Date.now(),
        title,
        price: (Math.random() * 5 + 3).toFixed(2), // 🔥 auto harga biar sama kayak dashboard
        poster_path: compressed,
        isLocal: true,
      };

      const existing =
        JSON.parse(localStorage.getItem("movies")) || [];

      localStorage.setItem(
        "movies",
        JSON.stringify([newMovie, ...existing])
      );

      setTitle("");
      setImage(null);

      navigate("/movies");
    } catch (err) {
      console.error(err);
      alert("Gagal upload gambar!");
    }
  };

  // 🔥 DRAG DROP
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setImage(file);
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">


      {/* CONTENT */}
      <div className="flex-grow flex items-center justify-center px-6 mt-14">
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-md border border-white/10 
          p-8 rounded-2xl w-full max-w-md shadow-xl text-center"
        >
          <h2 className="text-2xl font-bold mb-6">
            Add Movie
          </h2>

          {/* TITLE */}
          <input
            type="text"
            placeholder="Movie Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-lg bg-black/50 
            border border-gray-700 focus:outline-none focus:ring-2 
            focus:ring-red-500 transition"
          />

          {/* DROPZONE */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-700 
            rounded-xl p-6 cursor-pointer 
            hover:border-red-500 hover:bg-white/10 transition"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <p className="text-gray-400 text-sm">
              Pilih atau drag gambar PNG / JPG
            </p>
            <p className="text-xs text-gray-500">
              Maksimal 4MB
            </p>

            <input
              id="fileInput"
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
          </div>

          {/* PREVIEW */}
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="mt-4 rounded-lg max-h-40 mx-auto"
            />
          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full mt-6 bg-red-600 py-3 rounded-lg font-semibold 
            hover:bg-red-700 transition 
            shadow-[0_0_20px_rgba(220,38,38,0.6)] 
            hover:shadow-[0_0_30px_rgba(220,38,38,0.9)]"
          >
            Add Movie
          </button>
        </form>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 py-8 text-sm text-gray-500 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-6">
          <p>Flixy Film © 2026</p>

          <div className="flex gap-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/movies" className="hover:text-white">Movies</Link>
            <Link to="/add-movie" className="hover:text-white">Add Movie</Link>
            <Link to="/profile" className="hover:text-white">Profile</Link>
          </div>

          <p>Built with ❤️ by Flixy</p>
        </div>
      </footer>

    </div>
  );
};

export default AddMovies;