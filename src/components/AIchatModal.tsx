import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import AIChat from "./AIchat";

export default function AIChatModal() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Floating button */}
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg glow-primary"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="end"
        sideOffset={12}
        className="w-[360px] p-0 shadow-xl rounded-xl"
      >
        {/* Header */}
        <div className="px-4 py-2 border-b">
          <div className="flex justify-between items-center font-semibold">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Game Assistant
            </div>

            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="text-xl leading-none hover:text-muted-foreground"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4">
          <AIChat />
        </div>
      </PopoverContent>
    </Popover>
  );
}
