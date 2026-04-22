import { Routes, Route, useLocation } from "react-router-dom";
import MyNavbar from "./components/MyNavbar/MyNavbar.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Movies from "./pages/Movies/Movies.jsx";
import AddMovies from "./pages/AddMovies/AddMovies.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import EditMovies from "./pages/EditMovie/EditMovies.jsx";
import RoleAdmin from "./pages/Roles/RoleAdmin.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";

const App = () => {
  const location = useLocation();

  // 🔥 HIDE NAVBAR DI HALAMAN TERTENTU
  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <MyNavbar />}

      <Routes>
        {/* 🔥 LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* 🔥 MAIN APP */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/add-movie" element={<AddMovies />} />
        <Route path="/edit/:id" element={<EditMovies />} />
        <Route path="/admin" element={<RoleAdmin />} />
        <Route path="/profile" element={<Profile />} />

        {/* 🔥 AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
};

export default App;
