import { Link } from "react-router-dom";
import { Dice5, Instagram, Youtube, MessageCircle } from "lucide-react";
import logo from "../assets/logo.png"
const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-20 h-10 rounded-xl flex items-center justify-center">
                  <div className="w-24 h-24  rounded-xl flex items-center justify-center transition-all duration-300 group-hover:glow-primary">
            <img height={54} width={180} src={logo}/>
          </div>
              </div>
              <span className="text-xl font-bold">Awadh Board and Card Domain</span>
            </div>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Your ultimate destination for premium board games and strategic gaming experiences. Join our community and discover the joy of tabletop gaming.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-muted-foreground hover:text-primary transition-colors">
                  Book Session
                </Link>
              </li>
              <li>
                <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                  Features
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2 text-lg">Connect With Us</h4>
            <div className="flex gap-3 mb-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all"
              >
                <Instagram className="w-5 h-5 text-primary" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all"
              >
                <Youtube className="w-5 h-5 text-primary" />
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all"
              >
                <MessageCircle className="w-5 h-5 text-primary" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Open Daily: 10 AM - 12 AM
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-4 flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Awadh Board and Card Domain. All rights reserved.
          </p>
          {/* <div className="flex gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
