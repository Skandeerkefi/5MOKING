import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SlotCallCard } from "@/components/SlotCallCard";
import { useSlotCallStore } from "@/store/useSlotCallStore";
import { useState } from "react";
import { Dices, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";

function SlotCallsPage() {
  const { slotCalls, addSlotCall, acceptSlotCall, rejectSlotCall } = useSlotCallStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [slotName, setSlotName] = useState("");
  const [betAmount, setBetAmount] = useState<number>(100);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Filter slot calls based on search query and filter
  const filteredSlotCalls = slotCalls.filter(call => {
    const matchesSearch = call.slotName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         call.requester.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") {
      return matchesSearch;
    } else {
      return matchesSearch && call.status === filter;
    }
  });

  const handleSubmit = async () => {
    if (!slotName) {
      toast({
        title: "Error",
        description: "Please enter a slot name.",
        variant: "destructive",
      });
      return;
    }

    if (betAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid bet amount.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await addSlotCall(slotName, betAmount);
    setIsSubmitting(false);
    setSlotName("");
    setBetAmount(100);
  };

  const isAdmin = user?.isAdmin || false;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Dices className="h-6 w-6 text-secondary" />
            <h1 className="text-3xl font-bold">Slot Calls</h1>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" /> Request Slot Call
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request a Slot Call</DialogTitle>
                <DialogDescription>
                  Suggest a slot for 5MOKING to play during stream. Please provide the slot name and bet amount.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="slotName" className="text-sm font-medium">
                    Slot Name
                  </label>
                  <Input
                    id="slotName"
                    placeholder="e.g. Gates of Olympus"
                    value={slotName}
                    onChange={(e) => setSlotName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="betAmount" className="text-sm font-medium">
                    Bet Amount ($)
                  </label>
                  <Input
                    id="betAmount"
                    type="number"
                    min="50"
                    step="50"
                    placeholder="100"
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseInt(e.target.value))}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="glass-card rounded-lg p-6 mb-8">
          <p className="mb-6">
            Request 5MOKING to play your favorite slots during his streams! Slot calls are reviewed and may be played live on stream.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search slot calls..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Tabs defaultValue="all" onValueChange={(val) => setFilter(val as any)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="accepted">Accepted</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {filteredSlotCalls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredSlotCalls.map((slotCall) => (
              <SlotCallCard
                key={slotCall.id}
                id={slotCall.id}
                slotName={slotCall.slotName}
                requester={slotCall.requester}
                betAmount={slotCall.betAmount}
                timestamp={slotCall.timestamp}
                status={slotCall.status}
                onAccept={isAdmin ? acceptSlotCall : undefined}
                onReject={isAdmin ? rejectSlotCall : undefined}
                isAdminView={isAdmin}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Dices className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Slot Calls Found</h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery || filter !== "all"
                ? "No slot calls match your search criteria. Try different filters."
                : "Be the first to request a slot call!"}
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-1" /> Request Slot Call
                </Button>
              </DialogTrigger>
              <DialogContent>{/* Dialog content reused from above */}</DialogContent>
            </Dialog>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default SlotCallsPage;