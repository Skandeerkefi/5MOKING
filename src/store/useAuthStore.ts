import { create } from "zustand";
import { useToast } from "@/hooks/use-toast";

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  
  login: async (username, password) => {
    const { toast } = useToast();
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, we would make a real API call and validate credentials
      // For demo purposes, we'll allow any login and make "5MOKING" an admin
      const isAdmin = username.toLowerCase() === "5moking";
      
      const user: User = {
        id: `user-${Date.now()}`,
        username,
        isAdmin,
      };
      
      set({ user, isLoading: false });
      
      toast({
        title: "Logged In",
        description: `Welcome back, ${username}!`,
      });
      
      return true;
    } catch (error) {
      set({ isLoading: false });
      
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
      
      return false;
    }
  },
  
  signup: async (username, password) => {
    const { toast } = useToast();
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, we would make a real API call and create an account
      const user: User = {
        id: `user-${Date.now()}`,
        username,
        isAdmin: false,
      };
      
      set({ user, isLoading: false });
      
      toast({
        title: "Account Created",
        description: "Your account has been created successfully!",
      });
      
      return true;
    } catch (error) {
      set({ isLoading: false });
      
      toast({
        title: "Signup Failed",
        description: "Username may already be taken.",
        variant: "destructive",
      });
      
      return false;
    }
  },
  
  logout: () => {
    const { toast } = useToast();
    
    set({ user: null });
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  },
}));