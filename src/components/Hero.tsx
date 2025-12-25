import { Link, useNavigate } from "react-router-dom";
import { Dice5, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import logo from "../assets/logo.png"
const Hero = () =>{
  const navigate=useNavigate()
  return (
    <section className="mt-2 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] gradient-hero rounded-full blur-3xl opacity-50 -z-10" />
      
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Premium Gaming Experience</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
              Your Ultimate
              <br />
              <span className="text-gradient">Gaming Arena</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Experience premium board games, card games, and strategic competitions in our modern gaming hub. Connect with fellow gamers and create unforgettable moments.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Link to="/book">
              <Button variant="hero" size="xl">
                Book Your Session
              </Button>
            </Link>
            <Button variant="outline" size="xl" onClick={()=>navigate("/games")}>
              Explore Games
            </Button>
          </div>
          
          <div className="flex items-center gap-8 pt-4">
            <div>
              <p className="text-3xl font-bold text-gradient">60+</p>
              <p className="text-sm text-muted-foreground">Board Games</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <p className="text-3xl font-bold text-gradient">100+</p>
              <p className="text-sm text-muted-foreground">Happy Gamers</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <p className="text-3xl font-bold text-gradient">4.2★</p>
              <p className="text-sm text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>

        <div className="relative h-[500px] animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="absolute inset-0 gradient-hero rounded-3xl blur-3xl opacity-60" />
          <Card variant="hero" className="relative h-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="text-center relative z-10">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse-glow" />
                  <div className="w-40 h-44  rounded-xl flex items-center justify-center transition-all duration-300 group-hover:glow-primary">
            <img height={74} width={180} src={logo}/>
          </div>
              </div>
              <p className="mt-6 text-xl font-semibold text-primary">Premium Gaming Space</p>
              <p className="mt-2 text-muted-foreground">Where strategy meets fun</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;
