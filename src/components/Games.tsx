import React, { useState } from "react";
import {
  Sparkles,
  Users,
  Clock,
  Trophy,
  Search,
  Gamepad2,
  Dice5,
  Gamepad,
  Play,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const GamesGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const games = [
    {
      id: 1,
      name: "Monopoly",
      category: "board",
      players: "2-8",
      duration: "60-180 min",
      difficulty: "Easy",
      image:
        "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80",
      isOnline: false,
    },
    {
      id: 3,
      name: "Chess",
      category: "board",
      players: "2",
      duration: "30-60 min",
      difficulty: "Hard",
      image:
        "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=400&h=300&fit=crop",
      isOnline: false,
    },
    {
      id: 4,
      name: "Scrabble",
      category: "board",
      players: "2-4",
      duration: "90 min",
      difficulty: "Medium",
      image:
        "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=300&fit=crop",
      isOnline: false,
    },
    {
      id: 5,
      name: "Poker",
      category: "card",
      players: "2-10",
      duration: "60-120 min",
      difficulty: "Medium",
      image:
        "https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&h=300&fit=crop",
      isOnline: false,
    },
    {
      id: 6,
      name: "Catan",
      category: "board",
      players: "3-4",
      duration: "60-120 min",
      difficulty: "Medium",
      image:
        "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=300&fit=crop",
      isOnline: false,
    },
    {
      id: 8,
      name: "Cards Against Humanity",
      category: "card",
      players: "4-20",
      duration: "30-90 min",
      difficulty: "Easy",
      image:
        "https://images.unsplash.com/photo-1515569067071-ec3b51335dd0?w=400&h=300&fit=crop",
      isOnline: false,
    },
    {
      id: 9,
      name: "Flip7",
      category: "online",
      players: "2-3",
      duration: "15-30 min",
      difficulty: "Easy",
      image:
        "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80",
      isOnline: true,
      route: "/flip7",
    },
  ];

  const categories = [
    { id: "all", label: "All Games", icon: Gamepad2 },
    { id: "board", label: "Board Games", icon: Dice5 },
    { id: "card", label: "Card Games", icon: Trophy },
    { id: "online", label: "Online Games", icon: Gamepad },
  ];

  const filteredGames = games.filter((game) => {
    const matchesCategory =
      selectedCategory === "all" || game.category === selectedCategory;
    const matchesSearch = game.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleGameAction = (game) => {
    if (game.isOnline && game.route) {
      navigate(game.route);
    } else {
      navigate("/book");
    }
  };

  return (
    <div id="games" className="min-h-screen bg-background">
      <section className="pt-14 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] gradient-hero rounded-full blur-3xl opacity-50 -z-10" />

        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Premium Game Collection
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            Explore Our
            <br />
            <span className="text-gradient">Amazing Games</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover an incredible collection of classic and modern games. From
            strategic challenges to party favorites, we have something for every
            gaming enthusiast.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div
          className="mb-12 space-y-6 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="flex justify-center gap-3 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-lg glow-subtle scale-105"
                    : "bg-card text-foreground hover:bg-secondary border border-border"
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGames.map((game, index) => (
            <div
              key={game.id}
              className="group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative bg-card backdrop-blur-sm rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-xl glow-subtle-hover">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 gradient-hero opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* Online Badge for Flip7 */}
                {game.isOnline && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-primary/20 text-primary border border-primary/30 flex items-center gap-1 z-10">
                    <Gamepad className="w-3 h-3" />
                    Free{" "}
                  </div>
                )}

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>

                  {/* Difficulty badge */}
                  <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                      game.difficulty === "Easy"
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : game.difficulty === "Medium"
                        ? "bg-accent/20 text-accent border border-accent/30"
                        : "bg-destructive/20 text-destructive border border-destructive/30"
                    }`}
                  >
                    {game.difficulty}
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-6 space-y-4">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-gradient transition-all duration-300">
                    {game.name}
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg border border-border">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {game.players}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg border border-border">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {game.duration}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleGameAction(game)}
                    className={`w-full py-3 font-semibold rounded-xl opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:shadow-lg glow-subtle flex items-center justify-center gap-2 ${
                      game.isOnline
                        ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {game.isOnline ? (
                      <>
                        <Play className="w-4 h-4" />
                        Play Game
                      </>
                    ) : (
                      "Book Now"
                    )}
                  </button>
                </div>

                {/* Animated corner decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredGames.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse-glow" />
              <Trophy className="w-16 h-16 text-primary relative" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              No games found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter
            </p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background -z-10" />

          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Gaming <span className="text-gradient">Statistics</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Join our thriving gaming community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Trophy,
                label: "Total Games",
                value: games.length,
                color: "text-primary",
              },
              {
                icon: Users,
                label: "Active Players",
                value: "100+",
                color: "text-primary",
              },
              {
                icon: Sparkles,
                label: "Events Monthly",
                value: "50+",
                color: "text-primary",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-card backdrop-blur-sm border border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-all duration-300 hover:scale-105 group animate-fade-in"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <stat.icon className={`w-12 h-12 ${stat.color} relative`} />
                </div>
                <p className="text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .glow-subtle-hover:hover {
          box-shadow: 0 0 40px hsl(38 92% 50% / 0.15);
        }
      `}</style>
    </div>
  );
};

export default GamesGallery;
