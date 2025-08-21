const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 3000;

const allowedOrigins = [
	"http://localhost:5173",
	"https://5-moking.vercel.app",
];

app.use(
	cors({
		origin: function (origin, callback) {
			// allow requests with no origin like curl or Postman
			if (!origin) return callback(null, true);
			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			} else {
				return callback(new Error("CORS policy: This origin is not allowed"));
			}
		},
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

app.get("/api/affiliates", async (req, res) => {
	const { start_at, end_at } = req.query;

	if (!start_at || !end_at) {
		return res
			.status(400)
			.json({ error: "Missing start_at or end_at parameter" });
	}

	const url = `https://services.rainbet.com/v1/external/affiliates?start_at=${start_at}&end_at=${end_at}&key=${process.env.RAINBET_API_KEY}`;

	console.log("🔍 Fetching URL:", url);

	try {
		const response = await fetch(url);
		const content = await response.text();

		console.log("🌐 Rainbet response status:", response.status);
		console.log("📦 Rainbet response body:", content);

		if (!response.ok) {
			throw new Error(content);
		}

		res.json(JSON.parse(content));
	} catch (error) {
		console.error("❌ Error fetching affiliates data:", error.message);
		res.status(500).json({ error: "Failed to fetch affiliates data" });
	}
});

app.listen(PORT, () => {
	console.log(`✅ Server is running at http://localhost:${PORT}`);
});
