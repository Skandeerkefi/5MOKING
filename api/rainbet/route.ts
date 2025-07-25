import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	// Verify environment variables
	if (!process.env.RAINBET_API_KEY) {
		console.error("RAINBET_API_KEY is missing");
		return NextResponse.json(
			{ error: "Server configuration error" },
			{ status: 500 }
		);
	}

	const { searchParams } = new URL(request.url);
	const start_at = searchParams.get("start_at");
	const end_at = searchParams.get("end_at");

	if (!start_at || !end_at) {
		return NextResponse.json(
			{ error: "Missing start_at or end_at parameters" },
			{ status: 400 }
		);
	}

	try {
		const rainbetUrl = new URL(
			"https://services.rainbet.com/v1/external/affiliates"
		);
		rainbetUrl.searchParams.set("start_at", start_at);
		rainbetUrl.searchParams.set("end_at", end_at);
		rainbetUrl.searchParams.set("key", process.env.RAINBET_API_KEY);

		const response = await fetch(rainbetUrl.toString());

		// First check if we got JSON back
		const contentType = response.headers.get("content-type");
		if (!contentType?.includes("application/json")) {
			const text = await response.text();
			console.error("Rainbet API returned:", text.substring(0, 200));
			throw new Error("Rainbet API returned non-JSON response");
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch leaderboard data",
				details:
					process.env.NODE_ENV === "development"
						? error instanceof Error
							? error.message
							: String(error)
						: undefined,
			},
			{ status: 500 }
		);
	}
}
