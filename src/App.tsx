import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BookSession from "./pages/BookSession";
import NotFound from "./pages/NotFound";
import GamesGallery from "./components/Games";
import { GameBoard } from "./pages/Games/Flip7/GameBoard";
import { GameBoardMultiplayer } from "./pages/Games/Flip7/GameBoardMultiplayer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/book" element={<BookSession />} />
          <Route path="/games" element={<GamesGallery />} />

          <Route path="/flip7" element={<GameBoard />}/>
          <Route path="/flip7/multiplayer" element={<GameBoardMultiplayer />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
