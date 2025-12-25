import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dice5 } from "lucide-react";
import { Button } from "./ui/button";
import logo from "../assets/logo.png"
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <div className="w-28 h-24  rounded-xl flex items-center justify-center transition-all duration-300 group-hover:glow-primary">
            <img height={54} width={180} src={logo}/>
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
