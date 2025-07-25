import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GiveawayCard } from "@/components/GiveawayCard";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import { useState } from "react";
import { Gift, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/useAuthStore";

function GiveawaysPage() {
  const { giveaways, enterGiveaway } = useGiveawayStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "upcoming">("all");
  
  // Filter giveaways based on search query and filter
  const filteredGiveaways = giveaways.filter(giveaway => {
    const matchesSearch = 
      giveaway.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      giveaway.prize.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") {
      return matchesSearch;
    } else {
      return matchesSearch && giveaway.status === filter;
    }
  });

  const handleEnterGiveaway = async (id: string) => {
    if (!user) {
      // Redirect to login or show login dialog
      return;
    }
    
    await enterGiveaway(id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <div className="flex items-center gap-2 mb-8">
          <Gift className="h-6 w-6 text-secondary" />
          <h1 className="text-3xl font-bold">Giveaways</h1>
        </div>

        <div className="glass-card rounded-lg p-6 mb-8">
          <p className="mb-6">
            Join 5MOKING's exciting giveaways for a chance to win cash, gaming gear, and more!
            Regular giveaways are hosted for the community.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search giveaways..."
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
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {filteredGiveaways.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredGiveaways.map((giveaway) => (
              <GiveawayCard
                key={giveaway.id}
                id={giveaway.id}
                title={giveaway.title}
                prize={giveaway.prize}
                endTime={giveaway.endTime}
                participants={giveaway.participants}
                maxParticipants={giveaway.maxParticipants}
                status={giveaway.status}
                isEntered={giveaway.isEntered}
                onEnter={handleEnterGiveaway}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Giveaways Found</h2>
            <p className="text-muted-foreground">
              {searchQuery || filter !== "all"
                ? "No giveaways match your search criteria. Try different filters."
                : "Check back soon for upcoming giveaways!"}
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default GiveawaysPage;