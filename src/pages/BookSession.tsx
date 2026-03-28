import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Users,
  Skull,
  Eye,
  Shield,
  Zap,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

// ── Event Registry ────────────────────────────────────────────────────────────
// To add more events in future, push a new object into this array.
const EVENTS = [
  {
    id: "social-deduction-apr1",
    title: "Social Deduction Night",
    subtitle: "Mafia Vendetta · Secret Hitler · One Night Ultimate Warewolf · Coup",isoDate: "2026-04-01T16:00:00",
    date: "Tuesday, April 1st 2026",
    
    time: "4:00 PM onwards",
    venue: "Melons Studio, Lucknow",
    fee: 100,
    originalFee: 200,
    spotsLeft: 20,
    tags: ["Board Games", "Social Deduction"],
    icon: <Skull className="w-6 h-6" />,
    accentBorder: "border-red-500/40 hover:border-red-400/70",
    selectedBorder: "border-primary ring-2 ring-primary/30",
    gradientStrip: "from-red-700 to-primary",
    badge: "bg-red-500/20 text-red-300 border-red-500/30",
    games: [
      { name: "Mafia Vendetta", icon: <Skull className="w-4 h-4" /> },
      { name: "Secret Hitler", icon: <Eye className="w-4 h-4" /> },
      { name: "One Night Ultimate Werewolf", icon: <Shield className="w-4 h-4" /> },
      { name: "Coup", icon: <Zap className="w-4 h-4" /> },
    ],
    description:
      "An evening of bluffing, betrayal and social deduction. Multiple rounds of the best hidden-role games with fellow gamers. Beginners welcome!",
    upi: "8400224215@pthdfc",
    whatsapp: "918400224215",
    open: true,
  },
  // ← future events go here
] as const;

type EventType = (typeof EVENTS)[number];

// ── Live countdown ────────────────────────────────────────────────────────────
function Countdown({ isoDate }: { isoDate: string }) {
  const calc = () => {
    const diff = new Date(isoDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => {
      const diff = new Date(isoDate).getTime() - Date.now(); // ✅ inline, no stale closure
      if (diff <= 0) {
        setT({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isoDate]);

  return (
    <div className="flex gap-2">
      {(["days", "hours", "minutes", "seconds"] as const).map((k, i) => (
        <div
          key={k}
          className="bg-background/60 border border-border rounded-lg px-2.5 py-1.5 text-center min-w-[44px]"
        >
          <div className="text-sm font-black tabular-nums">
            {String(t[k]).padStart(2, "0")}
          </div>
          <div className="text-[9px] text-muted-foreground uppercase tracking-wider">
            {["Days", "Hrs", "Min", "Sec"][i]}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const BookSession = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [info, setInfo] = useState({ name: "", mobile: "", email: "" });
  const [errors, setErrors] = useState<Partial<typeof info>>({});
  const [qrCode, setQrCode] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  // Generate QR when event is chosen
  useEffect(() => {
    if (!selectedEvent) return;
    const upi = `upi://pay?pa=${selectedEvent.upi}&pn=ABCDArena&am=${selectedEvent.fee}&tn=${encodeURIComponent(selectedEvent.title)}`;
    QRCode.toDataURL(upi, {
      errorCorrectionLevel: "H",
      type: "image/png",
      margin: 2,
      width: 260,
      color: { dark: "#000000", light: "#ffffff" },
    }).then(setQrCode);
  }, [selectedEvent]);

  const validate = () => {
    const e: Partial<typeof info> = {};
    if (!info.name.trim()) e.name = "Name is required";
    if (!info.mobile.trim()) e.mobile = "Mobile is required";
    else if (!/^[6-9]\d{9}$/.test(info.mobile.trim()))
      e.mobile = "Enter a valid 10-digit number";
    if (info.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email))
      e.email = "Invalid email";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleConfirm = async () => {
    if (!selectedEvent) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const msg =
      ` ${selectedEvent.title}\n\n` +
      ` Name: ${info.name}\n` +
      ` Mobile: ${info.mobile}` +
      (info.email ? `\nEmail: ${info.email}` : "") +
      `\n\n Date: ${selectedEvent.date}` +
      `\n Time: ${selectedEvent.time}` +
      `\n Venue: ${selectedEvent.venue}` +
      `\n Entry Fee Paid: ₹${selectedEvent.fee}\n\nPlease attach Payment screenshot 👇`;
    window.open(
      `https://wa.me/${selectedEvent.whatsapp}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
    setLoading(false);
    setDone(true);
  };

  const STEP_LABELS = ["Choose Event", "Your Info", "Payment"];

  // ── Booking Received screen ─────────────────────────────────────────────────
  if (done && selectedEvent) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-slide-up">
          {/* Icon — clock/pending feel, not a full checkmark */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-500/50 flex items-center justify-center">
              <span className="text-4xl">🎲</span>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-2">Booking Received!</h2>
            <p className="text-muted-foreground leading-relaxed">
              Hey <span className="text-foreground font-semibold">{info.name}</span>, we got your request.
              Once we verify your payment screenshot on WhatsApp, we'll send you a confirmation.
            </p>
          </div>

          {/* What happens next */}
          <Card variant="glass" className="p-5 text-left space-y-4">
            <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">What happens next</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-primary">1</span>
                </div>
                <p className="text-sm text-muted-foreground">Send your payment screenshot on the WhatsApp that just opened</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-primary">2</span>
                </div>
                <p className="text-sm text-muted-foreground">Our team will verify and confirm your spot within a few hours</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-primary">3</span>
                </div>
                <p className="text-sm text-muted-foreground">You'll get venue details and reminders on <span className="text-foreground font-medium">{info.mobile}</span></p>
              </div>
            </div>
          </Card>

          {/* Event summary */}
          <Card variant="glass" className="p-4 text-left space-y-2">
            <p className="font-bold text-sm">{selectedEvent.title}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              {selectedEvent.date} · {selectedEvent.time}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              {selectedEvent.venue}
            </div>
          </Card>

          <p className="text-xs text-muted-foreground pb-4">
            Didn't send the screenshot?{" "}
            <a
              href={`https://wa.me/${selectedEvent.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              Open WhatsApp again
            </a>
          </p>

          <Link to="/">
            <Button variant="hero" className="w-full">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Sticky header ──────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-card/30 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          {step === 1 ? (
            <Link to="/">
              <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
            </Link>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h1 className="text-lg font-bold leading-tight">Book Your Session</h1>
            <p className="text-xs text-muted-foreground">
              Step {step} of 3 — {STEP_LABELS[step - 1]}
            </p>
          </div>
          {/* Step indicators */}
          <div className="ml-auto flex items-center gap-1.5">
            {STEP_LABELS.map((_, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    step > i + 1
                      ? "bg-primary border-primary text-primary-foreground"
                      : step === i + 1
                      ? "bg-primary/20 border-primary text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                {i < 2 && <div className="w-3 h-px bg-border hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-12">

        {/* ════════════════════════════════════════════════════════════════
            STEP 1 — Choose event
        ════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="animate-slide-up space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Upcoming Events</h2>
              <p className="text-muted-foreground text-sm">
                Select an event below to register your spot
              </p>
            </div>

            <div className="space-y-4">
              {EVENTS.filter((e) => e.open).length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  <div className="text-5xl mb-4">🎲</div>
                  <p className="font-semibold">No events open for registration right now</p>
                  <p className="text-sm mt-1">Check back soon!</p>
                </div>
              )}

              {EVENTS.filter((e) => e.open).map((event) => {
                const isSelected = selectedEvent?.id === event.id;
                return (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event as EventType)}
                    className={`w-full text-left rounded-2xl border bg-card/50 overflow-hidden transition-all duration-300 group ${
                      isSelected ? event.selectedBorder : event.accentBorder
                    }`}
                  >
                    {/* Thin color strip on top */}
                    <div className={`h-1 w-full bg-gradient-to-r ${event.gradientStrip}`} />

                    <div className="p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        {/* Event icon */}
                        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${event.badge}`}>
                          {event.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Title + fee */}
                          <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-xl leading-tight">{event.title}</h3>
                              {event.tags.map((t) => (
                                <span key={t} className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${event.badge}`}>
                                  {t}
                                </span>
                              ))}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="flex items-center justify-end gap-2">
                                <span className="line-through text-muted-foreground text-sm">₹{event.originalFee}</span>
                                <span className="text-2xl font-black text-gradient">₹{event.fee}</span>
                              </div>
                              <span className="text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-2 py-0.5 mt-1 inline-block">50% OFF</span>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            {event.description}
                          </p>

                          {/* Meta info */}
                          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground mb-4">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-primary" />{event.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-primary" />{event.time}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-primary" />{event.venue}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-primary" />{event.spotsLeft} spots left
                            </span>
                          </div>

                          {/* Game chips */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {event.games.map((g) => (
                              <span key={g.name} className="flex items-center gap-1.5 text-xs bg-background/60 border border-border rounded-lg px-2.5 py-1">
                                {g.icon}{g.name}
                              </span>
                            ))}
                          </div>

                          {/* Live countdown */}
                          <Countdown isoDate={event.isoDate} />
                        </div>
                      </div>

                      {/* Select row */}
                      <div className={`mt-5 pt-4 border-t border-border flex items-center justify-end gap-2 text-sm font-semibold transition-colors ${isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                        {isSelected ? (
                          <><CheckCircle className="w-4 h-4" /> Event Selected</>
                        ) : (
                          <>Select this Event <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              variant="hero"
              size="xl"
              className="w-full"
              disabled={!selectedEvent}
              onClick={() => setStep(2)}
            >
              Continue — {selectedEvent ? selectedEvent.title : "select an event first"}
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            STEP 2 — Player info
        ════════════════════════════════════════════════════════════════ */}
        {step === 2 && selectedEvent && (
          <div className="max-w-lg mx-auto animate-slide-up space-y-6">
            {/* Event recap */}
            <div className="flex items-center gap-3 bg-card/60 border border-border rounded-xl px-4 py-3">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${selectedEvent.badge}`}>
                {selectedEvent.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{selectedEvent.title}</p>
                <p className="text-muted-foreground text-xs">{selectedEvent.date} · {selectedEvent.venue}</p>
              </div>
              <div className="text-right">
                <span className="line-through text-muted-foreground text-xs">₹{selectedEvent.originalFee}</span>
                <span className="font-bold text-gradient text-sm block">₹{selectedEvent.fee}</span>
              </div>
            </div>

            <Card variant="glass" className="p-7 space-y-5">
              <div>
                <h3 className="text-xl font-bold mb-1">Your Details</h3>
                <p className="text-sm text-muted-foreground">We'll send the confirmation on WhatsApp</p>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Full Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arjun Sharma"
                  value={info.name}
                  onChange={(e) => setInfo((p) => ({ ...p, name: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-xl bg-background/60 border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.name ? "border-red-500" : "border-border"}`}
                />
                {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
              </div>

              {/* Mobile */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Mobile Number <span className="text-primary">*</span>
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 rounded-xl bg-background/60 border border-border text-muted-foreground text-sm font-medium select-none">+91</span>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    value={info.mobile}
                    maxLength={10}
                    onChange={(e) => setInfo((p) => ({ ...p, mobile: e.target.value.replace(/\D/g, "") }))}
                    className={`flex-1 px-4 py-3 rounded-xl bg-background/60 border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.mobile ? "border-red-500" : "border-border"}`}
                  />
                </div>
                {errors.mobile && <p className="text-red-400 text-xs">{errors.mobile}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="arjun@example.com"
                  value={info.email}
                  onChange={(e) => setInfo((p) => ({ ...p, email: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-xl bg-background/60 border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.email ? "border-red-500" : "border-border"}`}
                />
                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
              </div>

              <Button variant="hero" size="xl" className="w-full" onClick={() => validate() && setStep(3)}>
                Continue to Payment <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Card>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            STEP 3 — Payment
        ════════════════════════════════════════════════════════════════ */}
        {step === 3 && selectedEvent && (
          <div className="max-w-lg mx-auto animate-slide-up space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Pay & Confirm</h2>
              <p className="text-sm text-muted-foreground">
                Scan → pay ₹{selectedEvent.fee} → tap confirm to send screenshot on WhatsApp
              </p>
            </div>

            {/* Booking summary */}
            <Card variant="glass" className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{info.name}</p>
                  <p className="text-xs text-muted-foreground">{info.mobile}{info.email ? ` · ${info.email}` : ""}</p>
                </div>
                <button onClick={() => setStep(2)} className="text-xs text-primary underline underline-offset-2">Edit</button>
              </div>
              <div className="border-t border-border pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event</span>
                  <span className="font-medium text-right max-w-[60%]">{selectedEvent.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="text-right max-w-[60%]">{selectedEvent.date} · {selectedEvent.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Venue</span>
                  <span className="text-right max-w-[60%]">{selectedEvent.venue}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                  <span>Entry Fee</span>
                  <div className="flex items-center gap-2">
                    <span className="line-through text-muted-foreground text-sm">₹{selectedEvent.originalFee}</span>
                    <span className="text-gradient">₹{selectedEvent.fee}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* QR */}
            <Card variant="glass" className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" /> Scan to Pay ₹{selectedEvent.fee}
              </h3>
              {qrCode ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl flex justify-center">
                    <img src={qrCode} alt="UPI QR" className="w-56 h-56 object-contain" />
                  </div>
                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 text-center">
                    <p className="text-primary font-bold text-lg">₹{selectedEvent.fee}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">UPI: {selectedEvent.upi}</p>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Loading QR…</div>
              )}
            </Card>

            <Button variant="hero" size="xl" className="w-full" onClick={handleConfirm} disabled={loading}>
              {loading ? "Opening WhatsApp…" : "Confirm Booking via WhatsApp"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              After paying, tap the button — WhatsApp opens so you can send your payment screenshot.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSession;
