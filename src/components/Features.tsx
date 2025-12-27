import { Users, Trophy, Zap, Dice5, Coffee, Clock } from "lucide-react";
import { Card } from "./ui/card";

const features = [
  {
    icon: Users,
    title: "Community Gaming",
    description: "Connect with passionate gamers and build lasting friendships in our vibrant community.",
  },
  {
    icon: Trophy,
    title: "Tournaments",
    description: "Participate in exciting tournaments with amazing prizes and competitive gameplay.",
  },
  {
    icon: Zap,
    title: "Premium Experience",
    description: "State-of-the-art gaming space with comfortable seating and ambient atmosphere.",
  },
  {
    icon: Dice5,
    title: "Wide Selection",
    description: "Hundreds of games from classic favorites to the latest releases to choose from.",
  },
  {
    icon: Coffee,
    title: "Refreshments",
    description: "Enjoy snacks and beverages while you play your favorite games with friends.",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Open late hours to accommodate your gaming schedule whenever you want to play.",
  },
];

const Features = () => {
  return (
    <section id="why" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-gradient">ABCD</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We provide everything you need for an unforgettable gaming experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              variant="feature"
              className="p-8 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
