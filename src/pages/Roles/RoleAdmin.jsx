import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("requests")) || [];
    setRequests(data);
  }, []);

  const updateStatus = (id, status) => {
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status } : req
    );

    setRequests(updated);
    localStorage.setItem("requests", JSON.stringify(updated));
  };

  const filtered = requests.filter((r) =>
    filter === "all" ? true : r.status === filter
  );

  const count = (type) =>
    requests.filter((r) => r.status === type).length;

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">

      {/* 🔥 CONTENT */}
      <div className="flex-grow px-6 pt-24">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-2">
          🛡️ Admin Dashboard
        </h1>
        <p className="text-gray-400 mb-6">
          Review and approve purchase requests from users.
        </p>

        {/* FILTER */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {["pending", "approved", "rejected", "all"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm transition
                ${
                  filter === f
                    ? "bg-red-600 text-white"
                    : "bg-white/10 hover:bg-white/20"
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} (
              {f === "all" ? requests.length : count(f)})
            </button>
          ))}
        </div>

        {/* LIST */}
        {filtered.length === 0 ? (
          <div className="bg-white/5 border border-gray-800 rounded-xl p-10 text-center text-gray-400">
            No {filter} requests.
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((req) => (
              <div
                key={req.id}
                className="bg-[#111] border border-gray-800 p-4 rounded-xl flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{req.movieTitle}</p>
                  <p className="text-sm text-gray-400">
                    ${req.price} • {req.user}
                  </p>
                </div>

                <div className="flex gap-2">
                  {req.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(req.id, "approved")
                        }
                        className="bg-green-600 px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(req.id, "rejected")
                        }
                        className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {req.status !== "pending" && (
                    <span className="text-sm text-gray-400 capitalize">
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔥 FOOTER (FIXED RAPI) */}
      <footer className="border-t border-gray-800 py-6 text-sm text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-6">
          
          <p>Flixy Film © 2026</p>

          <div className="flex gap-6">
            <Link to="/dashboard" className="hover:text-white">Home</Link>
            <Link to="/movies" className="hover:text-white">Movies</Link>
            <Link to="/add-movie" className="hover:text-white">Add Movie</Link>
            <Link to="/admin" className="hover:text-white">Admin</Link>
            <Link to="/profile" className="hover:text-white">Profile</Link>
          </div>

          <p>Built with ❤️ by Flixy</p>

        </div>
      </footer>

    </div>
  );
};

export default AdminDashboard;