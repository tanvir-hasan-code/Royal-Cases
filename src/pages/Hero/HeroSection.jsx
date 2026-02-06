import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('/hero-royal-case.png')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <span className="inline-block mb-4 px-4 py-1 text-sm tracking-widest text-yellow-400 border border-yellow-400/40 rounded-full">
          PROFESSIONAL LEGAL MANAGEMENT
        </span>

        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          Royal <span className="text-yellow-400">Case</span>
        </h1>

        <p className="mt-5 max-w-2xl mx-auto text-gray-300 text-lg">
          Manage cases, clients, documents and court schedules with a secure and
          royal-grade system.
        </p>

        {/* 🔥 AUTH BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <button className="px-8 py-3 rounded bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition w-full sm:w-auto">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="px-8 py-3 rounded border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition w-full sm:w-auto">
              Create Account
            </button>
          </Link>
        </div>

        {/* Optional text */}
        <p className="mt-6 text-sm text-gray-400">
          New user? Create an account to get started ⚖️
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
