import { create } from "zustand";
import { useToast } from "@/hooks/use-toast";

export type SlotCallStatus = "pending" | "accepted" | "rejected";

export interface SlotCall {
  id: string;
  slotName: string;
  requester: string;
  betAmount: number;
  timestamp: string;
  status: SlotCallStatus;
}

interface SlotCallState {
  slotCalls: SlotCall[];
  isSubmitting: boolean;
  addSlotCall: (slotName: string, betAmount: number) => Promise<void>;
  acceptSlotCall: (id: string) => Promise<void>;
  rejectSlotCall: (id: string) => Promise<void>;
  fetchSlotCalls: () => Promise<void>;
}

// Mock data for demonstration
const generateMockSlotCalls = (): SlotCall[] => {
  const slotNames = [
    "Gates of Olympus",
    "Sweet Bonanza",
    "Sugar Rush",
    "Fruit Party",
    "Wild West Gold",
    "Starlight Princess",
    "Dog House",
    "Big Bass Bonanza"
  ];
  
  const statuses: SlotCallStatus[] = ["pending", "accepted", "rejected"];
  const requesters = ["Player123", "GamblingKing", "SlotLover", "BigWinner", "LuckyGuy"];
  
  const calls: SlotCall[] = [];
  
  for (let i = 1; i <= 10; i++) {
    const date = new Date();
    date.setHours(date.getHours() - Math.floor(Math.random() * 48));
    
    calls.push({
      id: `call-${i}`,
      slotName: slotNames[Math.floor(Math.random() * slotNames.length)],
      requester: requesters[Math.floor(Math.random() * requesters.length)],
      betAmount: (Math.floor(Math.random() * 20) + 1) * 50,
      timestamp: date.toLocaleString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }
  
  return calls;
};

export const useSlotCallStore = create<SlotCallState>((set, get) => ({
  slotCalls: generateMockSlotCalls(),
  isSubmitting: false,
  
  addSlotCall: async (slotName, betAmount) => {
    const { toast } = useToast();
    
    set({ isSubmitting: true });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newSlotCall: SlotCall = {
        id: `call-${Date.now()}`,
        slotName,
        requester: "You",
        betAmount,
        timestamp: new Date().toLocaleString(),
        status: "pending",
      };
      
      set((state) => ({
        slotCalls: [newSlotCall, ...state.slotCalls],
        isSubmitting: false,
      }));
      
      toast({
        title: "Slot Call Submitted",
        description: "Your slot call has been submitted for review.",
      });
    } catch (error) {
      set({ isSubmitting: false });
      
      toast({
        title: "Error",
        description: "Failed to submit your slot call. Please try again.",
        variant: "destructive",
      });
    }
  },
  
  acceptSlotCall: async (id) => {
    const { toast } = useToast();
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      set((state) => ({
        slotCalls: state.slotCalls.map((call) =>
          call.id === id ? { ...call, status: "accepted" } : call
        ),
      }));
      
      toast({
        title: "Slot Call Accepted",
        description: "The slot call has been accepted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept the slot call. Please try again.",
        variant: "destructive",
      });
    }
  },
  
  rejectSlotCall: async (id) => {
    const { toast } = useToast();
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      set((state) => ({
        slotCalls: state.slotCalls.map((call) =>
          call.id === id ? { ...call, status: "rejected" } : call
        ),
      }));
      
      toast({
        title: "Slot Call Rejected",
        description: "The slot call has been rejected.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject the slot call. Please try again.",
        variant: "destructive",
      });
    }
  },
  
  fetchSlotCalls: async () => {
    // In a real application, this would make an API call
    // For now, we'll just regenerate the mock data
    
    // Simulating API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    set({ slotCalls: generateMockSlotCalls() });
  },
}));