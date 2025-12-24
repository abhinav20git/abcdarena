import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import {
  ArrowLeft,
  CheckCircle,
  Upload,
  Minus,
  Plus,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const timeSlots = [
  "10:00 AM",
  "12:00 PM",
  "2:00 PM",
  "4:00 PM",
  "6:00 PM",
  "8:00 PM",
  "10:00 PM",
];

const PRICE_PER_PERSON = 100;

const BookSession = () => {
  const [qrCode, setQrCode] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [numberOfPeople, setNumberOfPeople] = useState<number>(2);
  const [totalAmount, setTotalAmount] = useState<number>(100);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<"payment" | "success">(
    "payment"
  );
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const upiString = `upi://pay?pa=gauravpande2002@okaxis&pn=ABCDArena&am=${totalAmount}&tn=Gaming%20Session%20Booking`;
    QRCode.toDataURL(upiString, {
      errorCorrectionLevel: "H",
      type: "image/png",
      margin: 2,
      width: 280,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    }).then((url) => {
      setQrCode(url);
    });
  }, [totalAmount]);

  const handleNumberChange = (delta: number) => {
    const newValue = numberOfPeople + delta;
    if (newValue >= 1 && newValue <= 20) {
      setNumberOfPeople(newValue);
      setTotalAmount(newValue * PRICE_PER_PERSON);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 100 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentConfirm = async () => {
    if (!selectedTime) {
      toast({
        title: "Select time slot",
        description: "Please select a time slot for your session",
        variant: "destructive",
      });
      return;
    }

    if (!uploadedFile) {
      toast({
        title: "Upload payment proof",
        description: "Please upload your payment screenshot",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Prepare WhatsApp message
    const message = `🎮 *New Gaming Session Booking*

📅 *Time Slot:* ${selectedTime}
👥 *Players:* ${numberOfPeople}
💰 *Amount Paid:* ₹${totalAmount}

Please attach Payment screenshot 👇`;

    // Open WhatsApp with prefilled message
    const phoneNumber = "917007258640"; // Replace with your actual WhatsApp number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");

    setIsLoading(false);
    setPaymentStatus("success");

    toast({
      title: "WhatsApp Opened!",
      description: "Please attach your payment screenshot and send",
    });
  };

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Card
          variant="glow"
          className="max-w-md w-full p-10 text-center animate-slide-up"
        >
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Payment Received!</h2>
          <p className="text-muted-foreground mb-2">
            Thank you for your booking.
          </p>
          <p className="text-muted-foreground mb-8">
            Our team will contact you via WhatsApp shortly to confirm your
            session details.
          </p>

          <div className="bg-card/50 rounded-xl p-4 mb-8 border border-border">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Time Slot</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Players</span>
              <span className="font-medium">{numberOfPeople}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-bold text-primary">₹{totalAmount}</span>
            </div>
          </div>

          <Link to="/">
            <Button variant="hero" className="w-full">
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/30 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Book Your Session</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Booking Details */}
          <div className="space-y-6">
            <Card variant="glass" className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Select Time Slot</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                      selectedTime === time
                        ? "bg-primary text-primary-foreground border-primary glow-subtle"
                        : "border-border hover:border-primary/50 hover:bg-card"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </Card>

            <Card variant="glass" className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Number of Players</h2>
              </div>

              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => handleNumberChange(-1)}
                  disabled={numberOfPeople <= 1}
                  className="w-12 h-12 rounded-xl border border-border hover:border-primary/50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-4xl font-bold min-w-16 text-center">
                  {numberOfPeople}
                </span>
                <button
                  onClick={() => handleNumberChange(1)}
                  disabled={numberOfPeople >= 20}
                  className="w-12 h-12 rounded-xl border border-border hover:border-primary/50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </Card>

            {/* Price Breakdown */}
            <Card variant="glass" className="p-6">
              <h3 className="font-semibold mb-4 text-lg">Price Summary</h3>
              <div className="space-y-3 pb-4 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    ₹{PRICE_PER_PERSON} × {numberOfPeople} players
                  </span>
                  <span>₹{numberOfPeople * PRICE_PER_PERSON}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span>2 Hours</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-xl pt-4">
                <span>Total</span>
                <span className="text-gradient">₹{totalAmount}</span>
              </div>
            </Card>
          </div>

          {/* Right: Payment */}
          <div className="space-y-6">
            <Card variant="glass" className="p-6">
              <h2 className="text-xl font-semibold mb-6">Scan to Pay</h2>
              {qrCode && (
                <div className="space-y-4">
                  <div className="bg-foreground p-4 rounded-xl flex justify-center">
                    <img src={qrCode} alt="UPI QR Code" className="w-64 h-64" />
                  </div>
                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
                    <p className="text-lg font-bold text-primary">
                      ₹{totalAmount}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      UPI: gauravpande2002@okaxis
                    </p>
                  </div>
                </div>
              )}
            </Card>

            <Card variant="glass" className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Upload Payment Proof
              </h2>

              {uploadPreview ? (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border border-primary/30 h-48">
                    <img
                      src={uploadPreview}
                      alt="Payment Screenshot"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Screenshot
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium mb-1">Click to upload screenshot</p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </Card>

            <Button
              variant="hero"
              size="xl"
              onClick={handlePaymentConfirm}
              disabled={isLoading || !uploadedFile || !selectedTime}
              className="w-full"
            >
              {isLoading ? "Processing..." : "Confirm Booking"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Our team will contact you on WhatsApp to confirm your booking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSession;
