import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowRight, Calendar } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Card variant="glow" className="p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-50" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Limited Slots Available</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to <span className="text-gradient">Play</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Book your gaming session now and get instant confirmation. Gather your friends for an epic gaming night!
            </p>
            
            <Link to="/book">
              <Button variant="hero" size="xl" className="group">
                Start Playing Today
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CTA;
