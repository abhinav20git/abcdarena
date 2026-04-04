import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, History } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      if (window.scrollY > 50) setIsOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Bar */}
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center h-16">
              <img src="/Logo.png" className="h-24 w-auto mt-4" />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-md font-medium">
            <span
              onClick={() => scrollToSection("why")}
              className="cursor-pointer hover:text-primary transition"
            >
              Why Us?
            </span>

            <span
              onClick={() => scrollToSection("games")}
              className="cursor-pointer hover:text-primary transition"
            >
              Games
            </span>

            <Link
              to="/events/history"
              className="flex items-center gap-1.5 hover:text-primary transition text-muted-foreground hover:text-foreground"
            >
              <History className="w-4 h-4" />
              Past Events
            </Link>

            <Link to="/book">
              <Button variant="hero" size="lg">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col gap-4 py-4 border-t border-border bg-background animate-in slide-in-from-top duration-300">
            <span
              onClick={() => scrollToSection("why")}
              className="cursor-pointer px-2"
            >
              Why Us?
            </span>

            <span
              onClick={() => scrollToSection("games")}
              className="cursor-pointer px-2"
            >
              Games
            </span>

            <Link
              to="/events/history"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-2 text-muted-foreground hover:text-primary transition"
            >
              <History className="w-4 h-4" />
              Past Events
            </Link>

            <Link to="/book" onClick={() => setIsOpen(false)}>
              <Button variant="hero" size="lg" className="w-full">
                Book Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
