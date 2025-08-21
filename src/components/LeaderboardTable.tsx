import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

type LeaderboardPeriod = "weekly" | "monthly";

interface LeaderboardPlayer {
	rank: number;
	username: string;
	wager: number;
	isFeatured?: boolean;
}

interface LeaderboardTableProps {
	period: LeaderboardPeriod;
	data: LeaderboardPlayer[];
}

function maskUsername(username: string): string {
	if (username.length <= 4) return username;
	const first = username.slice(0, 2);
	const last = username.slice(-1);
	return `${first}***${last}`;
}

const PRIZES = {
	weekly: {
		1: { amount: 125 },
		2: { amount: 75 },
		3: { amount: 15 },
	},
	monthly: {
		1: { amount: 1000 },
		2: { amount: 250, minWager: 30000 },
		3: { amount: 100, minWager: 10000 }, // ✅ condition only for 3rd
	},
};

export function LeaderboardTable({ period, data }: LeaderboardTableProps) {
	return (
		<div className='overflow-hidden border rounded-lg border-white/10'>
			<Table>
				<TableHeader className='bg-primary/10'>
					<TableRow>
						<TableHead className='w-12 text-center'>Rank</TableHead>
						<TableHead>Player</TableHead>
						<TableHead className='text-right'>Wager</TableHead>
						<TableHead className='text-right'>Prize</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((player) => {
						const prize = PRIZES[period][player.rank as 1 | 2 | 3] || 0;
						return (
							<TableRow
								key={maskUsername(player.username)}
								className={player.isFeatured ? "bg-primary/5" : ""}
							>
								<TableCell className='font-medium text-center'>
									{player.rank <= 3 ? (
										<div className='flex items-center justify-center'>
											<Crown
												className={`h-4 w-4 ${
													player.rank === 1
														? "text-yellow-400"
														: player.rank === 2
														? "text-gray-300"
														: "text-amber-600"
												}`}
											/>
										</div>
									) : (
										player.rank
									)}
								</TableCell>
								<TableCell className='flex items-center gap-2 font-medium'>
									{maskUsername(player.username)}
									{player.isFeatured && (
										<Badge
											variant='outline'
											className='border-primary text-primary'
										>
											Streamer
										</Badge>
									)}
								</TableCell>
								<TableCell className='text-right'>
									${player.wager.toLocaleString()}
								</TableCell>
								<TableCell className='text-right'>
									{prize > 0 ? `$${prize}` : "-"}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
