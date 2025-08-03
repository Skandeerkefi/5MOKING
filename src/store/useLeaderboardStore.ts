import { create } from "zustand";

export type LeaderboardPeriod = "weekly" | "monthly";

export interface LeaderboardPlayer {
	rank: number;
	username: string;
	wager: number;
	isFeatured?: boolean;
}

interface LeaderboardState {
	weeklyLeaderboard: LeaderboardPlayer[];
	monthlyLeaderboard: LeaderboardPlayer[];
	period: LeaderboardPeriod;
	isLoading: boolean;
	error: string | null;
	setPeriod: (period: LeaderboardPeriod) => void;
	fetchLeaderboard: (period: LeaderboardPeriod) => Promise<void>;
}

const API_URL = "https://mokingdata.onrender.com/api/affiliates";

const getDateRange = (
	period: LeaderboardPeriod
): { start_at: string; end_at: string } => {
	const now = new Date();
	const endDate = new Date(now);
	endDate.setHours(23, 59, 59, 999); // End of today

	if (period === "weekly") {
		// Weekly = from 1st day of current month until today
		const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
		startDate.setHours(0, 0, 0, 0);

		return {
			start_at: startDate.toISOString().split("T")[0],
			end_at: endDate.toISOString().split("T")[0],
		};
	} else {
		// Monthly = full current month (1st to last day)
		const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
		startDate.setHours(0, 0, 0, 0);

		const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		lastDay.setHours(23, 59, 59, 999);

		return {
			start_at: startDate.toISOString().split("T")[0],
			end_at: lastDay.toISOString().split("T")[0],
		};
	}
};

const processApiData = (data: any): LeaderboardPlayer[] => {
	if (!data?.affiliates || !Array.isArray(data.affiliates)) {
		console.error("Invalid API response structure - missing affiliates array");
		return [];
	}

	return data.affiliates
		.filter((item: any) => item && item.username)
		.map((item: any) => ({
			rank: 0, // will assign later after sorting
			username: item.username,
			wager: parseFloat(item.wagered_amount) || 0,
			isFeatured: item.username.toLowerCase().includes("5moking"),
		}))
		.sort((a, b) => b.wager - a.wager)
		.map((player, idx) => ({
			...player,
			rank: idx + 1,
		}));
};

export const useLeaderboardStore = create<LeaderboardState>((set, get) => ({
	weeklyLeaderboard: [],
	monthlyLeaderboard: [],
	period: "weekly",
	isLoading: false,
	error: null,
	setPeriod: (period) => set({ period }),
	fetchLeaderboard: async (period) => {
		set({ isLoading: true, error: null });

		try {
			const { start_at, end_at } = getDateRange(period);

			const response = await fetch(
				`${API_URL}?start_at=${start_at}&end_at=${end_at}`
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				throw new Error(
					errorData?.message ||
						errorData?.error ||
						`API request failed with status ${response.status}`
				);
			}

			const data = await response.json();

			const processedData = processApiData(data);

			if (period === "weekly") {
				set({ weeklyLeaderboard: processedData });
			} else {
				set({ monthlyLeaderboard: processedData });
			}
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "Unknown error",
				weeklyLeaderboard: period === "weekly" ? [] : get().weeklyLeaderboard,
				monthlyLeaderboard:
					period === "monthly" ? [] : get().monthlyLeaderboard,
			});
		} finally {
			set({ isLoading: false });
		}
	},
}));
