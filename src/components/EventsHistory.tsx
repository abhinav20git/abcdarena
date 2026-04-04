import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ALL_EVENTS } from "@/pages/BookSession";

const EventsHistory = () => {
  const past = ALL_EVENTS.filter((e) => !e.open);
  const upcoming = ALL_EVENTS.filter((e) => e.open);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/30 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link to="/book">
            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold leading-tight">Event History</h1>
            <p className="text-xs text-muted-foreground">All ABCD Arena events</p>
          </div>
          <Link to="/book" className="ml-auto">
            <Button variant="hero" size="sm">Register for Next Event</Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-12">

        {/* ── Upcoming ────────────────────────────────────────────────────── */}
        {upcoming.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2 h-6 bg-primary rounded-full" />
              <h2 className="text-xl font-bold">Upcoming</h2>
              <span className="text-xs bg-primary/20 text-primary border border-primary/30 rounded-full px-2.5 py-0.5 font-semibold">
                {upcoming.length} open
              </span>
            </div>
            <div className="space-y-4">
              {upcoming.map((event) => (
                <Link key={event.id} to="/book">
                  <div className="group rounded-2xl border border-primary/30 bg-card/50 overflow-hidden hover:border-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <div className={`h-1 w-full bg-gradient-to-r ${event.gradientStrip}`} />
                    <div className="p-5 flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${event.badge}`}>
                        {event.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <h3 className="font-bold text-lg">{event.title}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{event.subtitle}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center gap-1.5 justify-end">
                              <span className="line-through text-muted-foreground text-xs">₹{event.originalFee}</span>
                              <span className="font-black text-gradient text-lg">₹{event.fee}</span>
                            </div>
                            <span className="text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-2 py-0.5">50% OFF</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-3">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" />{event.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-primary" />{event.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" />{event.venue}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3 text-primary" />{event.spotsLeft} spots left</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {event.games.map((g) => (
                            <span key={g.name} className="flex items-center gap-1 text-[11px] bg-background/60 border border-border rounded-lg px-2 py-0.5">
                              {g.icon}{g.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Past events ─────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-2 h-6 bg-muted-foreground/40 rounded-full" />
            <h2 className="text-xl font-bold">Past Events</h2>
            <span className="text-xs bg-muted/50 text-muted-foreground border border-border rounded-full px-2.5 py-0.5 font-semibold">
              {past.length} completed
            </span>
          </div>

          {past.length === 0 && (
            <p className="text-muted-foreground text-sm">No past events yet.</p>
          )}

          <div className="space-y-4">
            {past.map((event) => (
              <Card key={event.id} variant="glass" className="overflow-hidden opacity-80">
                <div className={`h-1 w-full bg-gradient-to-r ${event.gradientStrip} opacity-40`} />
                <div className="p-5 flex items-start gap-4">
                  {/* Icon with completed overlay */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${event.badge} opacity-50`}>
                      {event.icon}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-background">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-muted-foreground">{event.title}</h3>
                          <span className="text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20 rounded-full px-2 py-0.5">
                            Completed
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">{event.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground/70 mt-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venue}</span>
                      {event.attendees > 0 && (
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{event.attendees} attended</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {event.games.map((g) => (
                        <span key={g.name} className="flex items-center gap-1 text-[11px] bg-background/40 border border-border/50 rounded-lg px-2 py-0.5 text-muted-foreground/70">
                          {g.icon}{g.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <div className="text-center py-6">
          <p className="text-muted-foreground mb-4 text-sm">Don't miss the next one!</p>
          <Link to="/book">
            <Button variant="hero" size="xl">Register for Next Event</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventsHistory;
