import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import InteractiveGradient from "./components/InteractiveGradient.jsx";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0D12]">
      <InteractiveGradient />

      <div className="relative z-10 min-h-screen flex flex-col text-white">
        <Navbar />

        <main className="flex-1 px-8 py-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
