import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dice5 } from "lucide-react";
import { Button } from "./ui/button";
import logo from "../assets/finalLogo.png";
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-28 h-16  rounded-xl flex items-center justify-center transition-all duration-300 group-hover:glow-primary">
            <img height={54} width={180} src={logo} />
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <span
              onClick={() => scrollToSection("hero")}
              className="cursor-pointer hover:text-primary transition"
            >
              Hero
            </span>

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
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/book">
            <Button variant="hero" size="lg">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
