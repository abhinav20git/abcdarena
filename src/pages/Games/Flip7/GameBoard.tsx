import { useState } from "react";
import { VintageCard } from "./VintageCard";
import { toast } from "sonner";
import { Shuffle, TrendingUp, RotateCcw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Card {
  type: 'number' | 'bonus' | 'secondChance' | 'freeze';
  value: number;
  id: string;
}

export const GameBoard = () => {
  const navigate=useNavigate()
  const createDeck = (): Card[] => {
    const deck: Card[] = [];
    
    // Add numbered cards (1-7)
    for (let num = 1; num <= 7; num++) {
      for (let count = 0; count < num; count++) {
        deck.push({ type: 'number', value: num, id: `${num}-${count}` });
      }
    }
    
    // Add special cards
    deck.push({ type: 'bonus', value: 1, id: 'bonus-1' });
    deck.push({ type: 'secondChance', value: 0, id: 'second-1' });
    deck.push({ type: 'freeze', value: 0, id: 'freeze-1' });
    
    return shuffleDeck(deck);
  };

  const shuffleDeck = (deck: Card[]): Card[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [flippedNumbers, setFlippedNumbers] = useState<Set<number>>(new Set());
  const [roundScore, setRoundScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [hasSecondChance, setHasSecondChance] = useState(false);
  const [isBusted, setIsBusted] = useState(false);
  const [lastFlippedCard, setLastFlippedCard] = useState<Card | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const flipCard = () => {
    if (deck.length === 0 || isBusted || isFlipping) return;

    setIsFlipping(true);
    const [drawnCard, ...remainingDeck] = deck;
    setLastFlippedCard(drawnCard);

    setTimeout(() => {
      setDeck(remainingDeck);
      
      if (drawnCard.type === 'number') {
        if (flippedNumbers.has(drawnCard.value)) {
          if (hasSecondChance) {
            setHasSecondChance(false);
            toast.info(`🛡️ Second Chance used! Drew ${drawnCard.value} again but you're safe!`);
            setFlippedCards(prev => [...prev, drawnCard]);
          } else {
            setIsBusted(true);
            toast.error(`💥 BUST! You drew ${drawnCard.value} again. Round over.`, { icon: "💥" });
          }
        } else {
          setFlippedNumbers(prev => new Set([...prev, drawnCard.value]));
          setFlippedCards(prev => [...prev, drawnCard]);
          setRoundScore(prev => prev + drawnCard.value);
          toast.success(`Drew ${drawnCard.value}! Round score: ${roundScore + drawnCard.value}`);
          
          // Check for 7-card bonus
          if (flippedCards.length + 1 === 7) {
            setTimeout(() => {
              setRoundScore(prev => prev + 10);
              toast.success('🎉 7 CARDS BONUS! +10 points!', { duration: 3000 });
            }, 500);
          }
        }
      } else if (drawnCard.type === 'bonus') {
        setFlippedCards(prev => [...prev, drawnCard]);
        setRoundScore(prev => prev + 1);
        toast.success('⚡ +1 Bonus Point!', { icon: "⚡" });
      } else if (drawnCard.type === 'secondChance') {
        setFlippedCards(prev => [...prev, drawnCard]);
        setHasSecondChance(true);
        toast.success('🛡️ Second Chance acquired!', { icon: "🛡️" });
      } else if (drawnCard.type === 'freeze') {
        setFlippedCards(prev => [...prev, drawnCard]);
        toast.info('❄️ Freeze card (multiplayer feature)', { icon: "❄️" });
      }

      setIsFlipping(false);
    }, 400);
  };

  const bankPoints = () => {
    if (roundScore === 0) {
      toast.error('No points to bank!');
      return;
    }

    setTotalScore(prev => prev + roundScore);
    toast.success(`✅ Banked ${roundScore} points! Total: ${totalScore + roundScore}`, {
      icon: "💰",
      duration: 3000,
    });
    startNewRound();
  };

  const startNewRound = () => {
    setFlippedCards([]);
    setFlippedNumbers(new Set());
    setRoundScore(0);
    setIsBusted(false);
    setLastFlippedCard(null);
  };

  const restartGame = () => {
    setDeck(createDeck());
    setFlippedCards([]);
    setFlippedNumbers(new Set());
    setRoundScore(0);
    setTotalScore(0);
    setHasSecondChance(false);
    setIsBusted(false);
    setLastFlippedCard(null);
    toast.success('New game started!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-game-bg-start via-game-bg-mid to-game-bg-end p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
       <div className="flex justify-end">
         <Button onClick={()=>navigate("/flip7/multiplayer")}>
          Multiplayer
        </Button>
       </div>
        {/* Header */}
        <div className="text-center mb-6 animate-bounce-in">
          <h1 className="text-5xl md:text-6xl font-bold text-game-title mb-2 drop-shadow-lg">
            Flip 7
          </h1>
          <p className="text-lg text-game-subtitle">
            Don't flip the same number twice!
          </p>
        </div>

        {/* Score Dashboard */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
          <div className="bg-card-vintage/90 backdrop-blur-sm rounded-xl p-4 md:p-6 text-center border-2 border-game-border shadow-lg">
            <div className="text-muted-foreground text-xs md:text-sm mb-1">Round Score</div>
            <div className="text-3xl md:text-4xl font-bold text-primary">
              {roundScore}
            </div>
          </div>
          <div className="bg-card-vintage/90 backdrop-blur-sm rounded-xl p-4 md:p-6 text-center border-2 border-game-border shadow-lg">
            <div className="text-muted-foreground text-xs md:text-sm mb-1">Total Score</div>
            <div className="text-3xl md:text-4xl font-bold text-game-success">{totalScore}</div>
          </div>
          <div className="bg-card-vintage/90 backdrop-blur-sm rounded-xl p-4 md:p-6 text-center border-2 border-game-border shadow-lg">
            <div className="text-muted-foreground text-xs md:text-sm mb-1">Cards Left</div>
            <div className="text-3xl md:text-4xl font-bold text-foreground">{deck.length}</div>
          </div>
        </div>

        {/* Status Bar */}
        {hasSecondChance && (
          <div className="bg-game-success/20 backdrop-blur-sm rounded-lg p-3 mb-4 border border-game-success/40 flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-game-success" />
            <span className="text-game-success font-semibold">Second Chance Active</span>
          </div>
        )}

        {/* Main Game Area */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Deck */}
          <div className="bg-card-vintage/70 backdrop-blur-sm rounded-xl p-6 border-2 border-game-border shadow-xl">
            <h3 className="text-foreground text-lg font-semibold mb-4 text-center">Deck</h3>
            <div className="flex justify-center items-center h-48 md:h-64">
              {deck.length > 0 ? (
                <div className="relative cursor-pointer" onClick={flipCard}>
                  <div className="absolute top-1 left-1 w-32 md:w-40 h-44 md:h-56 bg-card/30 rounded-xl"></div>
                  <div className="absolute top-2 left-2 w-32 md:w-40 h-44 md:h-56 bg-card/50 rounded-xl"></div>
                  <div className="w-32 md:w-40 h-44 md:h-56 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-2xl flex flex-col items-center justify-center transform transition-all hover:scale-105 border-4 border-game-border relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg"></div>
                    <Shuffle className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground mb-2" />
                    <span className="text-primary-foreground font-bold text-lg">{deck.length}</span>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground text-center">
                  <div className="text-5xl mb-2">🎴</div>
                  <div className="text-sm">Deck Empty</div>
                </div>
              )}
            </div>
          </div>

          {/* Last Flipped Card */}
          <div className="bg-card-vintage/70 backdrop-blur-sm rounded-xl p-6 border-2 border-game-border shadow-xl">
            <h3 className="text-foreground text-lg font-semibold mb-4 text-center">Current Card</h3>
            <div className="flex justify-center items-center h-48 md:h-64">
              {lastFlippedCard ? (
                <VintageCard card={lastFlippedCard} isFlipping={isFlipping} />
              ) : (
                <div className="text-muted-foreground text-center">
                  <div className="text-5xl mb-2">❓</div>
                  <div className="text-sm">Flip a card!</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Flipped Cards Display */}
        <div className="bg-card-vintage/70 backdrop-blur-sm rounded-xl p-4 md:p-6 mb-6 border-2 border-game-border shadow-xl">
          <h3 className="text-foreground text-lg font-semibold mb-4">Flipped This Round ({flippedCards.length})</h3>
          <div className="flex flex-wrap gap-2 md:gap-3 min-h-[80px] justify-center md:justify-start">
            {flippedCards.length === 0 ? (
              <div className="text-muted-foreground w-full text-center py-6 text-sm">No cards flipped yet</div>
            ) : (
              flippedCards.map((card, index) => (
                <VintageCard key={`${card.id}-${index}`} card={card} size="small" />
              ))
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center mb-6">
          <Button
            onClick={flipCard}
            disabled={deck.length === 0 || isBusted || isFlipping}
            className="w-full md:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-bold py-6 px-8 rounded-xl shadow-lg text-base md:text-lg"
          >
            <Shuffle className="w-5 h-5 mr-2" />
            Flip Card
          </Button>
          
          <Button
            onClick={bankPoints}
            disabled={roundScore === 0}
            className="w-full md:w-auto bg-gradient-to-r from-game-success to-game-success/80 hover:from-game-success/90 hover:to-game-success/70 text-white font-bold py-6 px-8 rounded-xl shadow-lg text-base md:text-lg"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Bank Points
          </Button>
          
          <Button
            onClick={restartGame}
            variant="outline"
            className="w-full md:w-auto font-bold py-6 px-8 rounded-xl shadow-lg text-base md:text-lg border-2"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Restart
          </Button>
        </div>

        {/* Game Rules */}
        <div className="bg-card-vintage/70 backdrop-blur-sm rounded-xl p-4 md:p-6 border-2 border-game-border shadow-xl">
          <h3 className="text-foreground text-base md:text-lg font-semibold mb-3">How to Play</h3>
          <ul className="text-muted-foreground space-y-2 text-xs md:text-sm">
            <li>• Flip cards one by one without repeating the same number</li>
            <li>• Each number card adds its value to your round score</li>
            <li>• Special cards: ⚡ +1 Bonus | 🛡️ Second Chance (survive one bust) | ❄️ Freeze</li>
            <li>• Flip 7 cards in a row without busting for +10 bonus points!</li>
            <li>• Bank your points anytime to add them to your total score</li>
            <li>• If you bust without Second Chance, you lose your round score</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
