import { Shield, Zap, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";

interface Card {
  type: 'number' | 'bonus' | 'secondChance' | 'freeze';
  value: number;
  id: string;
}

interface VintageCardProps {
  card: Card;
  isFlipping?: boolean;
  size?: 'small' | 'normal';
}

export const VintageCard = ({ card, isFlipping = false, size = 'normal' }: VintageCardProps) => {
  const getCardColor = () => {
    if (card.type === 'number') {
      const colors = [
        'from-red-600 to-red-700',
        'from-orange-600 to-orange-700',
        'from-amber-600 to-amber-700',
        'from-green-600 to-green-700',
        'from-blue-600 to-blue-700',
        'from-indigo-600 to-indigo-700',
        'from-purple-600 to-purple-700'
      ];
      return colors[card.value - 1];
    } else if (card.type === 'bonus') return 'from-yellow-500 to-orange-600';
    else if (card.type === 'secondChance') return 'from-emerald-500 to-green-600';
    else if (card.type === 'freeze') return 'from-cyan-500 to-blue-600';
    return 'from-gray-500 to-gray-600';
  };

  const getCardIcon = () => {
    if (card.type === 'bonus') return <Zap className={cn("text-white", size === 'small' ? "w-6 h-6" : "w-10 h-10")} />;
    if (card.type === 'secondChance') return <Shield className={cn("text-white", size === 'small' ? "w-6 h-6" : "w-10 h-10")} />;
    if (card.type === 'freeze') return <Snowflake className={cn("text-white", size === 'small' ? "w-6 h-6" : "w-10 h-10")} />;
    return null;
  };

  const getCardLabel = () => {
    if (card.type === 'number') {
      const labels = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN'];
      return labels[card.value - 1];
    } else if (card.type === 'bonus') return 'BONUS';
    else if (card.type === 'secondChance') return 'CHANCE';
    else if (card.type === 'freeze') return 'FREEZE';
    return '';
  };

  const sizeClasses = size === 'small' 
    ? 'w-16 h-24' 
    : 'w-32 md:w-40 h-44 md:h-56';

  return (
    <div
      className={cn(
        sizeClasses,
        "relative rounded-xl shadow-2xl transform transition-all",
        isFlipping ? "scale-0 rotate-180" : "scale-100 rotate-0 hover:scale-105"
      )}
      style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      {/* Card Background with Gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br rounded-xl",
        getCardColor()
      )}></div>
      
      {/* Vintage Border Pattern */}
      <div className="absolute inset-0 rounded-xl border-4 border-amber-900/40"></div>
      <div className="absolute inset-2 rounded-lg border-2 border-amber-100/30"></div>
      
      {/* Corner Decorations */}
      <div className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 border-amber-200/50 rounded-tl"></div>
      <div className="absolute top-1 right-1 w-3 h-3 border-r-2 border-t-2 border-amber-200/50 rounded-tr"></div>
      <div className="absolute bottom-1 left-1 w-3 h-3 border-l-2 border-b-2 border-amber-200/50 rounded-bl"></div>
      <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-amber-200/50 rounded-br"></div>
      
      {/* Card Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white p-3">
        {/* Main Value/Icon */}
        {card.type === 'number' ? (
          <div className={cn(
            "font-bold text-white drop-shadow-lg",
            size === 'small' ? "text-4xl" : "text-6xl md:text-7xl"
          )}>
            {card.value}
          </div>
        ) : (
          <div className="mb-1">
            {getCardIcon()}
          </div>
        )}
        
        {/* Label */}
        <div className={cn(
          "font-bold text-amber-100 tracking-wider mt-1",
          size === 'small' ? "text-[8px]" : "text-xs md:text-sm"
        )}>
          {getCardLabel()}
        </div>
      </div>
      
      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-xl pointer-events-none"></div>
    </div>
  );
};
