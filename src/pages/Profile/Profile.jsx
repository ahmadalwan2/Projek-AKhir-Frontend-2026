import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-6">

      <div className="w-full max-w-2xl">

        {/* CARD */}
        <div className="bg-white/5 p-8 rounded-xl text-center">

          <div className="w-24 h-24 mb-4 mx-auto">
            {user.role === "admin" ? (
              <img
                src="/admin-profile.png"
                alt="Admin Profile"
                className="w-full h-full rounded-full object-cover border-2 border-red-600 shadow-lg"
              />
            ) : ["budi@gmail.com", "santo@gmail.com"].includes(user.email) ? (
              <img
                src="/budi-image.jpg"
                alt="User Profile"
                className="w-full h-full rounded-full object-cover border-2 border-red-600 shadow-lg"
              />
            ) : user.email === "el@gmail.com" ? (
              <img
                src="/el-image.jpg"
                alt="El Profile"
                className="w-full h-full rounded-full object-cover border-2 border-red-600 shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto text-2xl mb-3">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>

          <h2 className="text-xl">{user.name}</h2>
          <p className="text-gray-400">{user.email}</p>

          {user.role === "admin" && (
            <p className="text-red-500 mt-2">
              ADMIN
            </p>
          )}

          <div className="mt-4 flex gap-3 justify-center">
            {user.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Admin Dashboard
              </button>
            )}

            <button
              onClick={() => {
                localStorage.removeItem("user");
                navigate("/login");
              }}
              className="bg-gray-700 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;