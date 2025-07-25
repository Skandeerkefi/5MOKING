import { create } from "zustand";
import { useToast } from "@/hooks/use-toast";

export type GiveawayStatus = "active" | "completed" | "upcoming";

export interface Giveaway {
  id: string;
  title: string;
  prize: string;
  endTime: string;
  participants: number;
  maxParticipants: number;
  status: GiveawayStatus;
  isEntered: boolean;
}

interface GiveawayState {
  giveaways: Giveaway[];
  fetchGiveaways: () => Promise<void>;
  enterGiveaway: (id: string) => Promise<void>;
}

// Mock data for demonstration
const generateMockGiveaways = (): Giveaway[] => {
  const prizes = [
    "$500 Cash",
    "$1,000 Rainbet Credits",
    "Gaming Headphones",
    "Gaming Chair",
    "iPhone 15 Pro",
    "PlayStation 5",
    "Xbox Series X",
    "Nvidia RTX 4080",
    "$250 Amazon Gift Card"
  ];
  
  const statuses: GiveawayStatus[] = ["active", "completed", "upcoming"];
  const titles = [
    "Weekly Cash Drop",
    "Monthly Mega Giveaway",
    "Subscriber Special",
    "1000 Followers Celebration",
    "Birthday Giveaway",
    "Holiday Special",
    "New Game Launch"
  ];
  
  const giveaways: Giveaway[] = [];
  
  for (let i = 1; i <= 6; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const participants = Math.floor(Math.random() * 80) + 20;
    const maxParticipants = 100;
    
    // Generate end time
    let endTime = "";
    if (status === "active") {
      const hours = Math.floor(Math.random() * 24) + 1;
      endTime = `Ends in ${hours} hours`;
    } else if (status === "completed") {
      const days = Math.floor(Math.random() * 10) + 1;
      endTime = `Ended ${days} days ago`;
    } else {
      const days = Math.floor(Math.random() * 7) + 1;
      endTime = `Starts in ${days} days`;
    }
    
    giveaways.push({
      id: `giveaway-${i}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      prize: prizes[Math.floor(Math.random() * prizes.length)],
      endTime,
      participants,
      maxParticipants,
      status,
      isEntered: Math.random() > 0.7,
    });
  }
  
  return giveaways;
};

export const useGiveawayStore = create<GiveawayState>((set) => ({
  giveaways: generateMockGiveaways(),
  
  fetchGiveaways: async () => {
    // In a real application, this would make an API call
    // For now, we'll just regenerate the mock data
    
    // Simulating API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    set({ giveaways: generateMockGiveaways() });
  },
  
  enterGiveaway: async (id: string) => {
    const { toast } = useToast();
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      set((state) => ({
        giveaways: state.giveaways.map((giveaway) =>
          giveaway.id === id
            ? {
                ...giveaway,
                isEntered: true,
                participants: giveaway.participants + 1,
              }
            : giveaway
        ),
      }));
      
      toast({
        title: "Successfully Entered",
        description: "You have been entered into the giveaway!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enter giveaway. Please try again.",
        variant: "destructive",
      });
    }
  },
}));