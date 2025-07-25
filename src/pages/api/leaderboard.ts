import type { NextApiRequest, NextApiResponse } from "next";

const API_KEY = "p6AFHUk45kWl00jB5upCA2ldKCrdsTsy";
const API_URL = "https://services.rainbet.com/v1/external/affiliates";

function getDateRange(period: "weekly" | "monthly") {
	const now = new Date();
	const endDate = new Date(now);
	endDate.setHours(23, 59, 59, 999);

	if (period === "weekly") {
		const startDate = new Date(now);
		startDate.setDate(now.getDate() - 7);
		startDate.setHours(0, 0, 0, 0);

		return {
			start_at: startDate.toISOString().split("T")[0],
			end_at: endDate.toISOString().split("T")[0],
		};
	} else {
		// Monthly
		const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
		startDate.setHours(0, 0, 0, 0);

		return {
			start_at: startDate.toISOString().split("T")[0],
			end_at: endDate.toISOString().split("T")[0],
		};
	}
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { period = "weekly" } = req.query;

	if (period !== "weekly" && period !== "monthly") {
		return res.status(400).json({ error: "Invalid period" });
	}

	const { start_at, end_at } = getDateRange(period as "weekly" | "monthly");

	try {
		const response = await fetch(
			`${API_URL}?start_at=${start_at}&end_at=${end_at}&key=${API_KEY}`
		);

		if (!response.ok) {
			const errorText = await response.text();
			return res.status(response.status).json({ error: errorText });
		}

		const data = await response.json();

		// Return JSON to client
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch leaderboard" });
	}
}
