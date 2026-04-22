import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFilm,
  FaShoppingCart,
  FaShieldAlt,
  FaPlay,
  FaChevronDown,
} from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeSection, setActiveSection] = useState("home");

  // 🔥 SCROLL ANIMATION
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-up");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
  }, []);

  // 🔥 SCROLL SPY (FIX NAV ACTIVE)
  useEffect(() => {
    const sections = ["home", "about", "how", "faq"];

    const handleScroll = () => {
      let current = "home";

      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          const top = section.offsetTop - 150;
          if (window.scrollY >= top) {
            current = id;
          }
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const navClass = (section) =>
    activeSection === section
      ? "text-red-500"
      : "text-gray-400 hover:text-white";

  const faqData = [
    {
      q: "Apa itu Flixy?",
      a: "Flixy adalah platform katalog film di mana kamu bisa request pembelian film yang ditinjau langsung oleh admin sebelum diberikan akses.",
    },
    {
      q: "Bagaimana cara membeli film?",
      a: "Login ke akun kamu, pilih film di halaman Movies, klik tombol Buy, lalu tunggu admin menyetujui permintaanmu.",
    },
    {
      q: "Berapa lama proses persetujuan?",
      a: "Biasanya tidak lama, status bisa kamu pantau di halaman Profile.",
    },
    {
      q: "Apakah bisa dibatalkan?",
      a: "Untuk saat ini pembatalan manual belum tersedia.",
    },
  ];

  return (
    <div className="bg-black text-white">

      {/* NAVBAR */}
      <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">

          <img
            src="/logo-flixy-film.svg"
            alt="Flixy Logo"
            className="h-8 md:h-9 w-auto object-contain"
          />

          <div className="flex gap-6 text-sm">
            <a href="#home" className={navClass("home")}>Home</a>
            <a href="#about" className={navClass("about")}>About</a>
            <a href="#how" className={navClass("how")}>How It Works</a>
            <a href="#faq" className={navClass("faq")}>FAQ</a>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="bg-red-600 px-4 py-1 rounded-lg hover:bg-red-700 transition shadow-lg"
          >
            Login
          </button>
        </div>
      </nav>

      {/* HERO 🔥 */}
      <section
        id="home"
        className="relative min-h-screen flex items-center px-6 overflow-hidden"
      >
        {/* BACKGROUND */}
        <div className="absolute inset-0">
          <img
            src="/cinema-bg.jpg"
            alt="Cinema"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/100 via-black/40 to-black"></div>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
          
          {/* LEFT CONTENT (NOW CENTERED) */}
          <div className="fade-up">
            <div className="inline-flex px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm mb-4">
              🎬 Cinema, curated for you
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Your Personal <br />
              <span className="text-red-500">Cinema Awaits</span>
            </h1>

            <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
              Jelajahi katalog film premium dengan sistem pembelian aman
              <br /> yang ditinjau langsung oleh admin.
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/login")}
                className="bg-red-600 px-8 py-4 rounded-xl hover:bg-red-700 font-bold transition shadow-xl shadow-red-600/30"
              >
                ▶ Get Started
              </button>

              <a
                href="#how"
                className="px-8 py-4 border border-white/20 rounded-xl hover:bg-white/10 transition"
              >
                How It Works
              </a>
            </div>

            <div className="flex gap-8 mt-10 text-gray-400 text-sm justify-center">
              <span>⭐ 4.9 Rating</span>
              <span>100% Curated</span>
              <span>Admin Verified</span>
            </div>
          </div>

        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 px-6 max-w-6xl mx-auto fade-up">
        <h2 className="text-3xl font-bold mb-6">About Flixy</h2>
        <p className="text-gray-400 mb-10">
          Flixy adalah platform katalog film modern yang menghadirkan pengalaman menjelajah film secara lebih terkurasi dan eksklusif.
          <br />
          Dengan sistem pembelian berbasis request yang ditinjau langsung oleh admin, setiap akses film menjadi lebih aman, terkontrol, <br /> dan berkualitas. Flixy dirancang untuk kamu yang ingin menikmati film dengan cara yang lebih premium dan personal.
        </p>
      </section>

      {/* HOW */}
<section id="how" className="py-24 text-center fade-up">
  <h2 className="text-4xl font-bold mb-3">How It Works</h2>

  <p className="text-gray-400 mb-14">
    Empat langkah mudah untuk mulai menikmati film favoritmu di Flixy.
  </p>

  <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">

    {[
      {
        title: "Browse Movies",
        desc: "Jelajahi koleksi film yang dikurasi langsung di katalog Flixy.",
        icon: <FaFilm />,
      },
      {
        title: "Request Pembelian",
        desc: "Pilih film favorit dan ajukan permintaan pembelian dengan satu klik.",
        icon: <FaShoppingCart />,
      },
      {
        title: "Persetujuan Admin",
        desc: "Admin meninjau permintaan dan menyetujuinya untuk membuka akses.",
        icon: <FaShieldAlt />,
      },
      {
        title: "Nikmati Film",
        desc: "Setelah disetujui, film masuk ke koleksi pribadi kamu.",
        icon: <FaPlay />,
      },
    ].map((step, i) => (
      <div
        key={i}
        className="
          group bg-gradient-to-b from-white/5 to-white/0 
          border border-white/10 p-6 rounded-2xl text-left
          hover:scale-105 transition duration-300
          backdrop-blur-md
          hover:shadow-[0_0_25px_rgba(220,38,38,0.25)]
        "
      >

        {/* ICON */}
        <div
          className="
            w-14 h-14 flex items-center justify-center
            bg-red-600 rounded-xl mb-5 text-white text-lg
            shadow-lg
            group-hover:scale-110 transition
          "
        >
          {step.icon}
        </div>

        {/* STEP */}
        <p className="text-red-500 text-xs mb-2 tracking-widest">
          STEP {String(i + 1).padStart(2, "0")}
        </p>

        {/* TITLE */}
        <h3 className="text-lg font-semibold mb-2">
          {step.title}
        </h3>

        {/* DESC */}
        <p className="text-gray-400 text-sm leading-relaxed">
          {step.desc}
        </p>

      </div>
    ))}

  </div>
</section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 max-w-3xl mx-auto fade-up">
        <h2 className="text-3xl font-bold text-center mb-10">FAQ</h2>

        {faqData.map((item, i) => (
          <div key={i} className="mb-3 bg-white/5 rounded-xl">
            <button
              onClick={() => toggleFAQ(i)}
              className="w-full flex justify-between px-4 py-4"
            >
              {item.q}
              <FaChevronDown 
                className={`transition-transform duration-300 text-gray-400 ${
                  activeIndex === i ? "rotate-180 text-red-500" : ""
                }`} 
              />
            </button>

            {activeIndex === i && (
              <p className="px-4 pb-4 text-gray-400 text-sm">{item.a}</p>
            )}
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 text-sm text-gray-500 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-6">
          <p>Flixy Film © 2026</p>

          <div className="flex gap-6">
            <a href="#home" className="hover:text-white transition">Home</a>
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#how" className="hover:text-white transition">How It Works</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </div>

          <p>Build with ❤️ by Flixy</p>
        </div>
      </footer>

      {/* ANIMATION */}
      <style>
        {`
        html {
          scroll-behavior: smooth;
        }
        .fade-up {
          opacity: 0;
          transform: translateY(40px);
          transition: 0.8s;
        }
        .fade-up.show {
          opacity: 1;
          transform: translateY(0);
        }
        `}
      </style>

    </div>
  );
};

export default LandingPage;