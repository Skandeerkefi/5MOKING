import { create } from "zustand";

interface GameState {
	numberOfMines: number;
	betSize: number;
	multiplier: number;
	winAmount: number;
	winningChance: number;
	minimalIncreaseOnLoss: number;
	board: Array<Array<"mine" | "diamond" | "empty">>;
	revealed: Array<Array<boolean>>;
	gameStatus: "idle" | "playing" | "won" | "lost";
	totalDiamonds: number;
	foundDiamonds: number;
}

interface GameActions {
	setNumberOfMines: (mines: number) => void;
	setBetSize: (bet: number) => void;
	generateBoard: () => void;
	revealCell: (row: number, col: number) => void;
	resetGame: () => void;
	calculateMultiplier: () => void;
}

const BOARD_SIZE = 5;
const DIAMONDS_COUNT = 1;

export const useMinesStore = create<GameState & GameActions>((set, get) => ({
	// Initial state
	numberOfMines: 8,
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
	totalDiamonds: DIAMONDS_COUNT,
	foundDiamonds: 0,

	// Actions
	setNumberOfMines: (mines) => {
		set({ numberOfMines: mines });
		get().calculateMultiplier();
	},

	setBetSize: (bet) => {
		set({ betSize: bet });
		get().calculateMultiplier();
	},

	generateBoard: () => {
		const { numberOfMines } = get();
		const newBoard = Array(BOARD_SIZE)
			.fill(null)
			.map(() => Array(BOARD_SIZE).fill("empty"));
		const newRevealed = Array(BOARD_SIZE)
			.fill(null)
			.map(() => Array(BOARD_SIZE).fill(false));

		// Place mines
		let minesPlaced = 0;
		while (minesPlaced < numberOfMines) {
			const row = Math.floor(Math.random() * BOARD_SIZE);
			const col = Math.floor(Math.random() * BOARD_SIZE);

			if (newBoard[row][col] === "empty") {
				newBoard[row][col] = "mine";
				minesPlaced++;
			}
		}

		// Place diamonds
		let diamondsPlaced = 0;
		while (diamondsPlaced < DIAMONDS_COUNT) {
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
		});
		get().calculateMultiplier();
	},

	revealCell: (row, col) => {
		const {
			board,
			revealed,
			gameStatus,
			betSize,
			foundDiamonds,
			totalDiamonds,
		} = get();

		if (gameStatus !== "playing" || revealed[row][col]) return;

		const newRevealed = revealed.map((arr) => [...arr]);
		newRevealed[row][col] = true;

		if (board[row][col] === "mine") {
			// Game over - hit a mine
			set({
				revealed: newRevealed,
				gameStatus: "lost",
				winAmount: 0,
			});
		} else if (board[row][col] === "diamond") {
			// Found a diamond
			const newFoundDiamonds = foundDiamonds + 1;
			let newGameStatus = gameStatus;
			let newWinAmount = 0;

			if (newFoundDiamonds === totalDiamonds) {
				// Found all diamonds - win
				newGameStatus = "won";
				newWinAmount = betSize * get().multiplier;
			}

			set({
				revealed: newRevealed,
				foundDiamonds: newFoundDiamonds,
				gameStatus: newGameStatus,
				winAmount: newWinAmount,
			});
		} else {
			// Empty cell
			set({ revealed: newRevealed });
		}
	},

	resetGame: () => {
		set({
			revealed: Array(BOARD_SIZE)
				.fill(null)
				.map(() => Array(BOARD_SIZE).fill(false)),
			gameStatus: "idle",
			foundDiamonds: 0,
			winAmount: 0,
			multiplier: 1.0,
		});
	},

	calculateMultiplier: () => {
		const { numberOfMines, betSize } = get();
		const totalCells = BOARD_SIZE * BOARD_SIZE;
		const safeCells = totalCells - numberOfMines;

		// Simplified multiplier calculation
		const baseMultiplier = 1 + (numberOfMines / safeCells) * 5;
		const winningChance = (safeCells / totalCells) * 100;
		const minimalIncrease = 0.8 + Math.random() * 0.2; // Random value between 0.8-1.0

		set({
			multiplier: parseFloat(baseMultiplier.toFixed(2)),
			winningChance: parseFloat(winningChance.toFixed(2)),
			minimalIncreaseOnLoss: parseFloat(minimalIncrease.toFixed(5)),
			winAmount: betSize * baseMultiplier,
		});
	},
}));
