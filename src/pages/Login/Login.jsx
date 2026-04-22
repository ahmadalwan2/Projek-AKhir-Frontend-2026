import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      const user = res.user;

      // 🔥 ROLE LOGIC
      const role = user.email === "admin@flixy.com" ? "admin" : "user";

      const userData = {
        name: user.displayName || user.email.split("@")[0],
        email: user.email,
        role,
      };

      // 🔥 SIMPAN KE LOCAL STORAGE
      localStorage.setItem("user", JSON.stringify(userData));

      // 🔥 Trigger event buat notify navbar
      window.dispatchEvent(new Event("userUpdated"));

      setLoggedInUser(userData.name);
      setShowSuccess(true);

      // 🔥 Redirect setelah delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message);
      setShowError(true);
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center text-white px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-xl text-center"
      >
        <img src="/logo-flixy-film.svg" alt="Flixy" className="h-10 mx-auto mb-4" />
        <p className="text-gray-400 mb-8">Login to your account</p>

        <input
          type="email"
          placeholder="Email Address"
          className="input"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="input"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="btn-primary mt-4"
        >
          Sign In
        </button>

        <p className="text-sm mt-6">
          Belum punya akun?{" "}
          <Link to="/register" className="text-red-500 hover:underline">
            Register
          </Link>
        </p>
      </form>

      {/* ERROR POPUP */}
      {showError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 p-8 rounded-2xl max-w-sm w-full text-center animate-fadeIn shadow-2xl">
            <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2 text-white">Login Failed</h3>
            <p className="text-gray-400 mb-6">{errorMessage}</p>
            <button 
              onClick={() => setShowError(false)}
              className="w-full bg-white/10 py-3 rounded-lg font-semibold hover:bg-white/20 transition border border-white/10"
            >
              Cek Lagi
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 p-8 rounded-2xl max-w-sm w-full text-center animate-fadeIn shadow-2xl">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4 scale-up-center" />
            <h3 className="text-2xl font-bold mb-2 text-white">Login Successful!</h3>
            <p className="text-gray-400">Selamat Datang di Flixy - {loggedInUser}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
