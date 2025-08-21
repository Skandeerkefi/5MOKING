import { create } from "zustand";

type CellType = "mine" | "diamond" | "empty";
type GameStatus = "idle" | "playing" | "won" | "lost";
type PatternMode = "random" | "custom";

interface GameState {
	numberOfMines: number;
	numberOfDiamonds: number;
	betSize: number;
	multiplier: number;
	winAmount: number;
	winningChance: number;
	minimalIncreaseOnLoss: number;
	board: CellType[][];
	revealed: boolean[][];
	gameStatus: GameStatus;
	foundDiamonds: number;
	patternMode: PatternMode;
	totalClicks: number;
}

interface GameActions {
	setNumberOfMines: (mines: number) => void;
	setNumberOfDiamonds: (diamonds: number) => void;
	setBetSize: (bet: number) => void;
	setPatternMode: (mode: PatternMode) => void;
	generateBoard: () => void;
	revealCell: (row: number, col: number) => void;
	resetGame: () => void;
	calculateMultiplier: () => void;
	generateRandomPattern: () => void;
}

const BOARD_SIZE = 5;

export const useMinesStore = create<GameState & GameActions>((set, get) => ({
	// Initial state
	numberOfMines: 8,
	numberOfDiamonds: 1,
	betSize: 2,
	multiplier: 1.0,
	winAmount: 0,
	winningChance: 0,
	minimalIncreaseOnLoss: 1.0,
	board: Array(BOARD_SIZE)
		.fill(null)
		.map(() => Array(BOARD_SIZE).fill("empty")),
	revealed: Array(BOARD_SIZE)
		.fill(null)
		.map(() => Array(BOARD_SIZE).fill(false)),
	gameStatus: "idle",
	foundDiamonds: 0,
	patternMode: "random",
	totalClicks: 0,

	// Actions
	setNumberOfMines: (mines) => {
		set({ numberOfMines: Math.min(Math.max(mines, 1), 24) });
		get().calculateMultiplier();
	},

	setNumberOfDiamonds: (diamonds) => {
		set({ numberOfDiamonds: Math.min(Math.max(diamonds, 1), 5) });
		get().calculateMultiplier();
	},

	setBetSize: (bet) => {
		set({ betSize: Math.max(bet, 0.1) });
		get().calculateMultiplier();
	},

	setPatternMode: (mode) => {
		set({ patternMode: mode });
	},

	generateBoard: () => {
		const { numberOfMines, numberOfDiamonds, patternMode } = get();

		// If in random mode, generate random number of mines and diamonds
		let actualMines = numberOfMines;
		let actualDiamonds = numberOfDiamonds;

		if (patternMode === "random") {
			actualMines = Math.floor(Math.random() * 15) + 5; // 5-19 mines
			actualDiamonds = Math.floor(Math.random() * 3) + 1; // 1-3 diamonds
		}

		const newBoard = Array(BOARD_SIZE)
			.fill(null)
			.map(() => Array(BOARD_SIZE).fill("empty"));
		const newRevealed = Array(BOARD_SIZE)
			.fill(null)
			.map(() => Array(BOARD_SIZE).fill(false));

		// Place mines
		let minesPlaced = 0;
		while (minesPlaced < actualMines) {
			const row = Math.floor(Math.random() * BOARD_SIZE);
			const col = Math.floor(Math.random() * BOARD_SIZE);

			if (newBoard[row][col] === "empty") {
				newBoard[row][col] = "mine";
				minesPlaced++;
			}
		}

		// Place diamonds
		let diamondsPlaced = 0;
		while (diamondsPlaced < actualDiamonds) {
			const row = Math.floor(Math.random() * BOARD_SIZE);
			const col = Math.floor(Math.random() * BOARD_SIZE);

			if (newBoard[row][col] === "empty") {
				newBoard[row][col] = "diamond";
				diamondsPlaced++;
			}
		}

		set({
			board: newBoard,
			revealed: newRevealed,
			gameStatus: "playing",
			foundDiamonds: 0,
			winAmount: 0,
			totalClicks: 0,
			numberOfMines: actualMines,
			numberOfDiamonds: actualDiamonds,
		});
		get().calculateMultiplier();
	},

	generateRandomPattern: () => {
		set({ patternMode: "random" });
		get().generateBoard();
	},

	revealCell: (row, col) => {
		const {
			board,
			revealed,
			gameStatus,
			betSize,
			foundDiamonds,
			numberOfDiamonds,
			totalClicks,
		} = get();

		if (gameStatus !== "playing" || revealed[row][col]) return;

		const newRevealed = revealed.map((arr) => [...arr]);
		newRevealed[row][col] = true;

		const newTotalClicks = totalClicks + 1;

		if (board[row][col] === "mine") {
			// Game over - hit a mine
			set({
				revealed: newRevealed,
				gameStatus: "lost",
				winAmount: 0,
				totalClicks: newTotalClicks,
			});
		} else if (board[row][col] === "diamond") {
			// Found a diamond
			const newFoundDiamonds = foundDiamonds + 1;
			let newGameStatus = gameStatus;
			let newWinAmount = 0;

			if (newFoundDiamonds === numberOfDiamonds) {
				// Found all diamonds - win
				newGameStatus = "won";
				newWinAmount = betSize * get().multiplier;
			}

			set({
				revealed: newRevealed,
				foundDiamonds: newFoundDiamonds,
				gameStatus: newGameStatus,
				winAmount: newWinAmount,
				totalClicks: newTotalClicks,
			});
		} else {
			// Empty cell
			set({ revealed: newRevealed, totalClicks: newTotalClicks });
		}
	},

	resetGame: () => {
		const { patternMode } = get();

		set({
			revealed: Array(BOARD_SIZE)
				.fill(null)
				.map(() => Array(BOARD_SIZE).fill(false)),
			gameStatus: "idle",
			foundDiamonds: 0,
			winAmount: 0,
			multiplier: 1.0,
			totalClicks: 0,
		});

		// Reset to default values if not in random mode
		if (patternMode === "custom") {
			set({
				numberOfMines: 8,
				numberOfDiamonds: 1,
			});
		}
	},

	calculateMultiplier: () => {
		const { numberOfMines, numberOfDiamonds, betSize, totalClicks } = get();
		const totalCells = BOARD_SIZE * BOARD_SIZE;
		const safeCells = totalCells - numberOfMines;

		// More realistic multiplier calculation
		const riskFactor = numberOfMines / totalCells;
		const diamondBonus = numberOfDiamonds * 0.3;
		const clickPenalty = totalClicks * 0.05;

		const baseMultiplier = 1 + riskFactor * 10 + diamondBonus - clickPenalty;
		const winningChance = (safeCells / totalCells) * 100;
		const minimalIncrease = 0.85 + Math.random() * 0.1; // Random value between 0.85-0.95

		set({
			multiplier: parseFloat(Math.max(baseMultiplier, 1.0).toFixed(2)),
			winningChance: parseFloat(winningChance.toFixed(2)),
			minimalIncreaseOnLoss: parseFloat(minimalIncrease.toFixed(5)),
			winAmount: parseFloat((betSize * baseMultiplier).toFixed(2)),
		});
	},
}));
