interface DateRange {
	start_at: string;
	end_at: string;
}

const API_KEY =
	process.env.REACT_APP_RAINBET_API_KEY || "p6AFHUk45kWl00jB5upCA2ldKCrdsTsy";
const BASE_URL = "https://services.rainbet.com/v1/external/affiliates";

const getDateRange = (period: "weekly" | "monthly"): DateRange => {
	const now = new Date();
	const endDate = new Date(now);
	endDate.setHours(23, 59, 59, 999);

	let startDate: Date;
	if (period === "weekly") {
		startDate = new Date(now);
		startDate.setDate(now.getDate() - 7);
	} else {
		startDate = new Date(now.getFullYear(), now.getMonth(), 1);
	}
	startDate.setHours(0, 0, 0, 0);

	return {
		start_at: startDate.toISOString().split("T")[0],
		end_at: endDate.toISOString().split("T")[0],
	};
};

export const fetchLeaderboardData = async (period: "weekly" | "monthly") => {
	const { start_at, end_at } = getDateRange(period);
	const url = `${BASE_URL}?start_at=${start_at}&end_at=${end_at}&key=${API_KEY}`;

	try {
		// First try with CORS mode
		let response = await fetch(url, {
			headers: {
				Accept: "application/json",
			},
		});

		// If we get HTML back, the API might be blocking us
		const contentType = response.headers.get("content-type");
		if (contentType?.includes("text/html")) {
			throw new Error("API returned HTML - likely CORS issue");
		}

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			throw new Error(
				errorData?.message ||
					errorData?.error ||
					`API request failed with status ${response.status}`
			);
		}

		return await response.json();
	} catch (error) {
		// Fallback to proxy if direct request fails
		return fetchViaProxy(period);
	}
};

const fetchViaProxy = async (period: "weekly" | "monthly") => {
	// You'll need to set up a simple proxy server
	const PROXY_URL =
		process.env.REACT_APP_PROXY_URL ||
		"https://5-moking.vercel.app/leaderboard";

	try {
		const response = await fetch(`${PROXY_URL}/rainbet?period=${period}`);

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			throw new Error(
				errorData?.error ||
					`Proxy request failed with status ${response.status}`
			);
		}

		return await response.json();
	} catch (error) {
		console.error("Proxy fetch failed:", error);
		throw error;
	}
};
