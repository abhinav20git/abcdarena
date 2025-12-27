// GameBoardMultiplayer.tsx
import { useState, useEffect } from "react";
import { VintageCard } from "./VintageCard";
import { toast } from "sonner";
import {
  Shuffle,
  TrendingUp,
  Users,
  LogIn,
  Copy,
  Check,
  Crown,
  Shield,
} from "lucide-react";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";
import {Socket} from "socket.io-client";

interface Card {
  type: "number" | "bonus" | "secondChance" | "freeze";
  value: number;
  id: string;
}

interface Player {
  playerId: string;
  username: string;
  socketId: string;
  totalScore: number;
  roundScore: number;
  flippedCards: Card[];
  flippedNumbers: number[];
  hasSecondChance: boolean;
  isFrozen: boolean;
  freezeTurnsLeft: number;
  isBusted: boolean;
  isReady: boolean;
}

interface GameRoom {
  roomId: string;
  players: Player[];
  deck: Card[];
  currentTurn: number;
  gameStatus: "waiting" | "playing" | "finished";
  maxPlayers: number;
  roundNumber: number;
  maxRounds: number;
}

interface Winner {
  playerId: string;
  username: string;
  finalScore: number;
}

const BACKEND_URL= import.meta.env.VITE_BACKEND_URL;

export const GameBoardMultiplayer = () => {
  // Auth state
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  // Room state
  const [roomId, setRoomId] = useState("");
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [inRoom, setInRoom] = useState(false);

  // Game state
  const [gameStatus, setGameStatus] = useState<
    "lobby" | "waiting" | "playing" | "finished"
  >("lobby");
  const [players, setPlayers] = useState<Player[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [message, setMessage] = useState("Welcome to Flip 7 Multiplayer!");
  const [lastFlippedCard, setLastFlippedCard] = useState<Card | null>(null);
  const [winner, setWinner] = useState<Winner | null>(null);
  const [copied, setCopied] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  // Socket connection
  const [socket, setSocket] = useState<typeof Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(BACKEND_URL, {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("roomUpdate", ({ room }: { room: GameRoom }) => {
      setCurrentRoom(room);
      setPlayers(room.players);
      setDeck(room.deck);
    });

    socket.on(
      "joinedRoom",
      ({ roomId, playerId }: { roomId: string; playerId: string }) => {
        setRoomId(roomId);
        toast.success(`Joined room ${roomId}`);
      }
    );

    socket.on("gameStart", ({ room }: { room: GameRoom }) => {
      setGameStatus("playing");
      setCurrentRoom(room);
      setPlayers(room.players);
      setDeck(room.deck);
      setMessage("Game started! First player's turn.");
      toast.success("Game started!", { icon: "🎮" });
    });

    socket.on(
      "cardFlipped",
      ({
        room,
        drawnCard,
        message,
      }: {
        room: GameRoom;
        drawnCard: Card;
        message: string;
      }) => {
        setCurrentRoom(room);
        setPlayers(room.players);
        setDeck(room.deck);
        setLastFlippedCard(drawnCard);
        setMessage(message);
        setIsFlipping(false);

        // Show appropriate toast
        const currentPlayer = room.players.find((p) => p.playerId === playerId);
        if (currentPlayer?.isBusted) {
          toast.error(message, { icon: "💥" });
        } else if (drawnCard.type === "bonus") {
          toast.success(message, { icon: "⚡" });
        } else if (drawnCard.type === "secondChance") {
          toast.success(message, { icon: "🛡️" });
        } else if (drawnCard.type === "freeze") {
          toast.info(message, { icon: "❄️" });
        } else {
          toast.success(message);
        }
      }
    );

    socket.on(
      "pointsBanked",
      ({ room, message }: { room: GameRoom; message: string }) => {
        setCurrentRoom(room);
        setPlayers(room.players);
        setMessage(message);
        toast.success(message, { icon: "💰" });
      }
    );

    socket.on("turnChange", ({ room }: { room: GameRoom }) => {
      setCurrentRoom(room);
      setPlayers(room.players);
      setLastFlippedCard(null);
      const currentTurnPlayer = room.players[room.currentTurn];
      setMessage(`${currentTurnPlayer.username}'s turn!`);

      if (currentTurnPlayer.playerId === playerId) {
        toast.info("It's your turn!", { icon: "🎯" });
      }
    });

    socket.on(
      "gameEnd",
      ({ room, winner }: { room: GameRoom; winner: Winner }) => {
        setGameStatus("finished");
        setWinner(winner);
        setPlayers(room.players);
        setMessage(
          `Game Over! ${winner.username} wins with ${winner.finalScore} points!`
        );
        toast.success(`${winner.username} wins!`, {
          icon: "👑",
          duration: 5000,
        });
      }
    );

    socket.on("error", ({ message }: { message: string }) => {
      setMessage(`Error: ${message}`);
      toast.error(message);
      setIsFlipping(false);
    });

    return () => {
      socket.off("roomUpdate");
      socket.off("joinedRoom");
      socket.off("gameStart");
      socket.off("cardFlipped");
      socket.off("pointsBanked");
      socket.off("turnChange");
      socket.off("gameEnd");
      socket.off("error");
    };
  }, [socket, playerId]);

  // Register player
  const registerPlayer = async () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/players/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setPlayerId(data.player.playerId);
        setIsRegistered(true);
        setMessage(`Welcome, ${username}! Create or join a room.`);
        toast.success(`Welcome, ${username}!`);
      } else {
        toast.error("Failed to register");
      }
    } catch (error) {
      toast.error("Error connecting to server");
      console.error(error);
    }
  };

  // Create room
  const createRoom = async () => {
    if (!playerId) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/rooms/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, username }),
      });

      const data = await response.json();

      if (data.success) {
        setRoomId(data.roomId);
        setCurrentRoom(data.room);
        setPlayers(data.room.players);
        setDeck(data.room.deck);
        setInRoom(true);
        setGameStatus("waiting");

        // Join socket room
        socket?.emit("joinRoom", { roomId: data.roomId, playerId, username });

        setMessage(`Room created! Share code: ${data.roomId}`);
        toast.success(`Room created: ${data.roomId}`);
      }
    } catch (error) {
      toast.error("Error creating room");
      console.error(error);
    }
  };

  // Join room
  const joinRoom = () => {
    if (!roomId.trim()) {
      toast.error("Please enter a room code");
      return;
    }

    if (!playerId || !socket) return;

    socket.emit("joinRoom", {
      roomId: roomId.trim().toUpperCase(),
      playerId,
      username,
    });
    setInRoom(true);
    setGameStatus("waiting");
  };

  // Mark player as ready
  const markReady = () => {
    if (!socket || !roomId || !playerId) return;
    socket.emit("playerReady", { roomId, playerId });
    toast.success("You are ready!");
  };

  // Flip card
  const flipCard = () => {
    if (!socket || !roomId || !playerId) return;
    setIsFlipping(true);
    socket.emit("flipCard", { roomId, playerId });
  };

  // Bank points
  const bankPoints = () => {
    if (!socket || !roomId || !playerId) return;
    socket.emit("bankPoints", { roomId, playerId });
  };

  // End turn
  const endTurn = () => {
    if (!socket || !roomId || !playerId) return;
    socket.emit("endTurn", { roomId, playerId });
    toast.info("Turn ended");
  };

  // Copy room code
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    toast.success("Room code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const currentPlayer = players.find((p) => p.playerId === playerId);
  const isMyTurn =
    currentRoom &&
    currentRoom.currentTurn !== undefined &&
    players[currentRoom.currentTurn]?.playerId === playerId;

  // Login Screen
  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-game-bg-start via-game-bg-mid to-game-bg-end flex items-center justify-center p-8">
        <div className="bg-card-vintage/90 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border-2 border-game-border shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-game-title mb-2 drop-shadow-lg">
              Flip 7
            </h1>
            <p className="text-game-subtitle">Multiplayer Card Game</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && registerPlayer()}
              className="w-full px-4 py-3 rounded-lg bg-background/80 text-foreground placeholder-muted-foreground border-2 border-game-border focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <Button
              onClick={registerPlayer}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-bold py-6 shadow-lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Join Game
            </Button>
          </div>

          <div className="mt-8 text-center text-muted-foreground text-sm">
            <p>For 3 players • Press your luck • Don't bust!</p>
          </div>
        </div>
      </div>
    );
  }

  // Lobby Screen
  if (!inRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-game-bg-start via-game-bg-mid to-game-bg-end flex items-center justify-center p-8">
        <div className="bg-card-vintage/90 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border-2 border-game-border shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-game-title mb-2">
              Welcome, {username}!
            </h2>
            <p className="text-game-subtitle">Create or join a game room</p>
          </div>

          <div className="space-y-6">
            <Button
              onClick={createRoom}
              className="w-full bg-gradient-to-r from-game-success to-game-success/80 hover:from-game-success/90 hover:to-game-success/70 text-white font-bold py-6 shadow-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              Create New Room
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-game-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card-vintage text-muted-foreground">
                  OR
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter room code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === "Enter" && joinRoom()}
                className="w-full px-4 py-3 rounded-lg bg-background/80 text-foreground placeholder-muted-foreground border-2 border-game-border focus:outline-none focus:ring-2 focus:ring-primary text-center text-xl tracking-wider"
                maxLength={6}
              />

              <Button
                onClick={joinRoom}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-bold py-6 shadow-lg"
              >
                Join Room
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Waiting Room
  if (gameStatus === "waiting") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-game-bg-start via-game-bg-mid to-game-bg-end p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-game-title mb-2 drop-shadow-lg">
              Flip 7
            </h1>
            <p className="text-game-subtitle">Waiting for players...</p>
          </div>

          {/* Room Code */}
          <div className="bg-card-vintage/90 backdrop-blur-md rounded-xl p-6 mb-6 border-2 border-game-border shadow-xl text-center">
            <p className="text-muted-foreground text-sm mb-2">Room Code</p>
            <div className="flex items-center justify-center gap-3">
              <div className="text-4xl font-bold text-game-title tracking-wider">
                {roomId}
              </div>
              <button
                onClick={copyRoomCode}
                className="bg-primary/20 hover:bg-primary/30 p-2 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-6 h-6 text-game-success" />
                ) : (
                  <Copy className="w-6 h-6 text-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Players List */}
          <div className="bg-card-vintage/90 backdrop-blur-md rounded-xl p-6 mb-6 border-2 border-game-border shadow-xl">
            <h3 className="text-foreground text-xl font-semibold mb-4">
              Players ({players.length}/3)
            </h3>
            <div className="space-y-3">
              {players.map((player, index) => (
                <div
                  key={player.playerId}
                  className={`bg-background/50 rounded-lg p-4 flex items-center justify-between border-2 ${
                    player.playerId === playerId
                      ? "border-primary"
                      : "border-game-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        ["bg-red-600", "bg-blue-600", "bg-green-600"][index]
                      }`}
                    >
                      {player.username[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-foreground font-semibold">
                        {player.username}
                        {player.playerId === playerId && (
                          <span className="text-primary text-sm ml-2">
                            (You)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {player.isReady && (
                    <div className="bg-game-success/30 px-3 py-1 rounded-full border border-game-success/50">
                      <span className="text-game-success text-sm font-semibold">
                        Ready
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ready Button */}
          {currentPlayer && !currentPlayer.isReady && (
            <Button
              onClick={markReady}
              className="w-full bg-gradient-to-r from-game-success to-game-success/80 hover:from-game-success/90 hover:to-game-success/70 text-white font-bold py-6 shadow-lg text-lg"
            >
              Ready to Play!
            </Button>
          )}

          {currentPlayer && currentPlayer.isReady && (
            <div className="text-center text-muted-foreground">
              Waiting for other players...
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Game Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-game-bg-start via-game-bg-mid to-game-bg-end p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-game-title mb-1 drop-shadow-lg">
            Flip 7
          </h1>
          <p className="text-game-subtitle">
            Room: {roomId} • Round {currentRoom?.roundNumber}/
            {currentRoom?.maxRounds}
          </p>
        </div>

        {/* Players Status */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
          {players.map((player, index) => {
            const isCurrentTurn =
              currentRoom && index === currentRoom.currentTurn;
            const isCurrentPlayer = player.playerId === playerId;

            return (
              <div
                key={player.playerId}
                className={`bg-card-vintage/90 backdrop-blur-md rounded-xl p-3 md:p-4 border-2 ${
                  isCurrentTurn
                    ? "border-game-success ring-2 ring-game-success"
                    : "border-game-border"
                } ${isCurrentPlayer ? "ring-2 ring-primary" : ""} shadow-lg`}
              >
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      ["bg-red-600", "bg-blue-600", "bg-green-600"][index]
                    }`}
                  >
                    {player.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground font-semibold text-sm md:text-base flex items-center gap-1 truncate">
                      <span className="truncate">{player.username}</span>
                      {isCurrentPlayer && (
                        <span className="text-xs text-primary">(You)</span>
                      )}
                      {isCurrentTurn && (
                        <Crown className="w-3 h-3 md:w-4 md:h-4 text-game-success flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-muted-foreground text-xs md:text-sm">
                      Score: {player.totalScore}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 md:gap-2 flex-wrap">
                  {player.isFrozen && (
                    <div className="bg-cyan-500/30 px-2 py-1 rounded text-cyan-200 text-[10px] md:text-xs border border-cyan-400/50">
                      ❄️ Frozen
                    </div>
                  )}

                  {player.hasSecondChance && (
                    <div className="bg-game-success/30 px-2 py-1 rounded text-game-success text-[10px] md:text-xs border border-game-success/50">
                      🛡️ Chance
                    </div>
                  )}
                </div>

                <div className="mt-2 text-muted-foreground text-xs">
                  Round: {player.roundScore} | Cards:{" "}
                  {player.flippedCards.length}
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Bar */}
        <div className="bg-card-vintage/90 backdrop-blur-md rounded-xl p-3 md:p-4 mb-6 border-2 border-game-border text-center shadow-lg">
          <div
            className={`text-foreground text-base md:text-lg font-semibold ${
              isMyTurn ? "text-game-success" : ""
            }`}
          >
            {message}
          </div>
        </div>

        {/* Game Area */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Deck */}
          <div className="bg-card-vintage/90 backdrop-blur-md rounded-xl p-4 md:p-6 border-2 border-game-border shadow-xl">
            <h3 className="text-foreground text-lg font-semibold mb-4 text-center">
              Deck ({deck.length} cards)
            </h3>
            <div className="flex justify-center items-center h-48">
              {deck.length > 0 ? (
                <div className="relative">
                  <div className="absolute top-1 left-1 w-28 h-40 md:w-32 md:h-44 bg-card/30 rounded-xl"></div>
                  <div className="absolute top-2 left-2 w-28 h-40 md:w-32 md:h-44 bg-card/50 rounded-xl"></div>
                  <div className="w-28 h-40 md:w-32 md:h-44 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-2xl flex flex-col items-center justify-center border-4 border-game-border relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg"></div>
                    <Shuffle className="w-10 h-10 md:w-12 md:h-12 text-primary-foreground" />
                    <span className="text-primary-foreground font-bold text-lg mt-2">
                      {deck.length}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground text-center">
                  <div className="text-5xl mb-2">🎴</div>
                  <div className="text-sm">Empty</div>
                </div>
              )}
            </div>
          </div>

          {/* Last Card */}
          <div className="bg-card-vintage/90 backdrop-blur-md rounded-xl p-4 md:p-6 border-2 border-game-border shadow-xl">
            <h3 className="text-foreground text-lg font-semibold mb-4 text-center">
              Current Card
            </h3>
            <div className="flex justify-center items-center h-48">
              {lastFlippedCard ? (
                <VintageCard
                  card={lastFlippedCard}
                  isFlipping={isFlipping}
                  size="normal"
                />
              ) : (
                <div className="text-muted-foreground text-center">
                  <div className="text-5xl mb-2">❓</div>
                  <div className="text-sm">Flip a card!</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Player Cards */}
        {currentPlayer && currentPlayer.flippedCards.length > 0 && (
          <div className="bg-card-vintage/90 backdrop-blur-md rounded-xl p-4 md:p-6 mb-6 border-2 border-game-border shadow-xl">
            <h3 className="text-foreground text-lg font-semibold mb-4">
              Your Cards This Round ({currentPlayer.flippedCards.length})
            </h3>
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
              {currentPlayer.flippedCards.map((card, index) => (
                <VintageCard
                  key={`${card.id}-${index}`}
                  card={card}
                  size="small"
                />
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {/* Action Buttons */}
        {gameStatus === "playing" && (
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center mb-6">
            <Button
              onClick={flipCard}
              disabled={!isMyTurn || currentPlayer?.isFrozen || isFlipping}
              className="w-full md:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 disabled:from-muted disabled:to-muted disabled:cursor-not-allowed text-primary-foreground font-bold py-5 md:py-6 px-6 md:px-8 shadow-lg"
            >
              <Shuffle className="w-5 h-5 mr-2" />
              Flip Card
            </Button>

            <Button
              onClick={bankPoints}
              disabled={
                !isMyTurn || !currentPlayer || currentPlayer.roundScore === 0
              }
              className="w-full md:w-auto bg-gradient-to-r from-game-success to-game-success/80 hover:from-game-success/90 hover:to-game-success/70 disabled:from-muted disabled:to-muted disabled:cursor-not-allowed text-white font-bold py-5 md:py-6 px-6 md:px-8 shadow-lg"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Bank & End Turn
            </Button>

          </div>
        )}
        {/* Game Finished */}
        {gameStatus === "finished" && winner && (
          <div className="bg-gradient-to-r from-game-success to-primary rounded-xl p-6 md:p-8 text-center mb-6 shadow-2xl">
            <Crown className="w-12 h-12 md:w-16 md:h-16 text-white mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {winner.username} Wins!
            </h2>
            <p className="text-white text-lg md:text-xl">
              Final Score: {winner.finalScore}
            </p>

            <div className="mt-6 space-y-2">
              {players
                .sort((a, b) => b.totalScore - a.totalScore)
                .map((player, index) => (
                  <div
                    key={player.playerId}
                    className="bg-white/20 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold text-lg">
                        {index + 1}.
                      </span>
                      <span className="text-white font-semibold">
                        {player.username}
                      </span>
                    </div>
                    <span className="text-white font-bold">
                      {player.totalScore}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Game Rules */}
        <div className="bg-card-vintage/90 backdrop-blur-md rounded-xl p-4 md:p-6 border-2 border-game-border shadow-xl">
          <h3 className="text-foreground text-base md:text-lg font-semibold mb-3">
            How to Play
          </h3>
          <ul className="text-muted-foreground space-y-2 text-xs md:text-sm">
            <li>• Take turns flipping cards without repeating numbers</li>
            <li>
              • Special cards: ⚡ +1 Bonus | 🛡️ Second Chance | ❄️ Freeze
              opponent
            </li>
            <li>• Flip 7 cards in a row for +10 bonus points!</li>
            <li>• Bank points or end turn to secure your score</li>
            <li>• Highest score after {currentRoom?.maxRounds} rounds wins!</li>
            <li>
              • If you bust without Second Chance, you lose your round score
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
