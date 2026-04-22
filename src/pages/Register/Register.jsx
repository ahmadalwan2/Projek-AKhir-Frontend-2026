import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebaseConfig.js";
import { FaCheckCircle } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Password tidak sama!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // simpan nama ke Firebase
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // 🔥 simpan role (admin kalau email khusus)
      const role = email === "admin@flixy.com" ? "admin" : "user";

      localStorage.setItem(
        "user",
        JSON.stringify({
          name,
          email,
          role,
        })
      );

      setShowSuccess(true);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center text-white px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white/5 backdrop-blur-md border border-white/10 
        p-8 rounded-2xl w-full max-w-md shadow-xl text-center"
      >
        <img src="/logo-flixy-film.svg" alt="Flixy" className="h-10 mx-auto mb-4" />
        <p className="text-gray-400 mb-6">Create your account</p>

        <input
          type="text"
          placeholder="Full Name"
          className="input"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="input"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="input"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="input"
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button className="btn-primary mt-4">
          Create Account
        </button>

        <p className="text-xs text-gray-400 mt-3">
          Tip: register with <span className="text-red-500">admin@flixy.com</span> to get admin role
        </p>

        <p className="text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-red-500">
            Sign In
          </Link>
        </p>
      </form>

      {/* POPUP BERHASIL */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 p-8 rounded-2xl max-w-sm w-full text-center animate-fadeIn shadow-2xl">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4 scale-up-center" />
            <h3 className="text-2xl font-bold mb-2 text-white">Registration Successful!</h3>
            <p className="text-gray-400 mb-6">Your account has been created successfully. Welcome to Flixy!</p>
            <button 
              onClick={() => navigate("/login")}
              className="btn-primary"
            >
              Continue to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;