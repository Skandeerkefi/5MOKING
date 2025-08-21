import React, { useState, useEffect } from "react";
import "./Mines.css";

type CellType = "mine" | "diamond" | "empty";
type PatternMode = "random" | "custom";

const MinesPatternGenerator: React.FC = () => {
	const [numberOfMines, setNumberOfMines] = useState<number>(8);
	const [numberOfDiamonds, setNumberOfDiamonds] = useState<number>(1);
	const [patternMode, setPatternMode] = useState<PatternMode>("random");
	const [board, setBoard] = useState<CellType[][]>([]);
	const [generatedPatterns, setGeneratedPatterns] = useState<CellType[][][]>(
		[]
	);
	const [history, setHistory] = useState<CellType[][][]>([]);

	const BOARD_SIZE = 5;

	useEffect(() => {
		generateBoard();
	}, []);

	const generateBoard = () => {
		let actualMines = numberOfMines;
		let actualDiamonds = numberOfDiamonds;

		if (patternMode === "random") {
			actualMines = Math.floor(Math.random() * 15) + 5; // 5-19 mines
			actualDiamonds = Math.floor(Math.random() * 3) + 1; // 1-3 diamonds
		}

		const newBoard = Array(BOARD_SIZE)
			.fill(null)
			.map(() => Array(BOARD_SIZE).fill("empty"));

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

		setBoard(newBoard);
		setGeneratedPatterns((prev) => [newBoard, ...prev.slice(0, 4)]);
		setHistory((prev) => [newBoard, ...prev]);
	};

	const generateRandomPattern = () => {
		setPatternMode("random");
		generateBoard();
	};

	const handleMinesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value) || 1;
		setNumberOfMines(Math.min(Math.max(value, 1), 24));
	};

	const handleDiamondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value) || 1;
		setNumberOfDiamonds(Math.min(Math.max(value, 1), 5));
	};

	const renderCell = (cell: CellType) => {
		switch (cell) {
			case "mine":
				return <div className='pattern-cell mine'>💣</div>;
			case "diamond":
				return <div className='pattern-cell diamond'>💎</div>;
			default:
				return <div className='pattern-cell empty' />;
		}
	};

	const calculateProbability = (row: number, col: number) => {
		// Simple probability calculation based on surrounding cells
		let mineCount = 0;
		let diamondCount = 0;

		for (
			let r = Math.max(0, row - 1);
			r <= Math.min(BOARD_SIZE - 1, row + 1);
			r++
		) {
			for (
				let c = Math.max(0, col - 1);
				c <= Math.min(BOARD_SIZE - 1, col + 1);
				c++
			) {
				if (r === row && c === col) continue;
				if (board[r][c] === "mine") mineCount++;
				if (board[r][c] === "diamond") diamondCount++;
			}
		}

		// Very basic probability estimation
		if (mineCount > 0 && diamondCount > 0) return "50%";
		if (mineCount > 0) return "High risk";
		if (diamondCount > 0) return "Good chance";
		return "Unknown";
	};

	return (
		<div className='mines-pattern-generator'>
			<h1>Mines Pattern Generator</h1>
			<p className='subtitle'>Generate patterns to try in real mines games</p>

			<div className='pattern-selector'>
				<h3>Pattern Generation Mode:</h3>
				<div className='pattern-buttons'>
					<button
						className={patternMode === "random" ? "active" : ""}
						onClick={() => setPatternMode("random")}
					>
						Random Pattern
					</button>
					<button
						className={patternMode === "custom" ? "active" : ""}
						onClick={() => setPatternMode("custom")}
					>
						Custom Settings
					</button>
				</div>
			</div>

			<div className='game-controls'>
				{patternMode === "custom" && (
					<>
						<div className='control-group'>
							<label htmlFor='mines'>Number of Mines:</label>
							<input
								id='mines'
								type='number'
								min='1'
								max='24'
								value={numberOfMines}
								onChange={handleMinesChange}
							/>
						</div>

						<div className='control-group'>
							<label htmlFor='diamonds'>Number of Diamonds:</label>
							<input
								id='diamonds'
								type='number'
								min='1'
								max='5'
								value={numberOfDiamonds}
								onChange={handleDiamondsChange}
							/>
						</div>
					</>
				)}

				<button onClick={generateBoard} className='generate-btn'>
					Generate New Pattern
				</button>

				<button onClick={generateRandomPattern} className='random-btn'>
					Randomize Pattern
				</button>
			</div>

			<div className='main-pattern'>
				<h2>Current Pattern</h2>
				<div className='pattern-board'>
					{board.map((row, rowIndex) => (
						<div key={rowIndex} className='pattern-row'>
							{row.map((cell, colIndex) => (
								<div key={colIndex} className='pattern-cell-container'>
									{renderCell(cell)}
									<div className='probability'>
										{calculateProbability(rowIndex, colIndex)}
									</div>
								</div>
							))}
						</div>
					))}
				</div>

				<div className='pattern-stats'>
					<div className='stat'>
						<span className='stat-label'>Mines:</span>
						<span className='stat-value'>
							{board.flat().filter((cell) => cell === "mine").length}
						</span>
					</div>
					<div className='stat'>
						<span className='stat-label'>Diamonds:</span>
						<span className='stat-value'>
							{board.flat().filter((cell) => cell === "diamond").length}
						</span>
					</div>
					<div className='stat'>
						<span className='stat-label'>Empty Cells:</span>
						<span className='stat-value'>
							{board.flat().filter((cell) => cell === "empty").length}
						</span>
					</div>
				</div>
			</div>

			<div className='pattern-history'>
				<h2>Recently Generated Patterns</h2>
				<div className='history-patterns'>
					{generatedPatterns.map((pattern, index) => (
						<div key={index} className='history-pattern'>
							<h4>Pattern #{index + 1}</h4>
							<div className='mini-board'>
								{pattern.map((row, rowIndex) => (
									<div key={rowIndex} className='mini-row'>
										{row.map((cell, colIndex) => (
											<div key={colIndex} className='mini-cell'>
												{cell === "mine"
													? "💣"
													: cell === "diamond"
													? "💎"
													: "◻"}
											</div>
										))}
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>

			<div className='tips-section'>
				<h2>Mines Game Tips</h2>
				<div className='tips'>
					<div className='tip'>
						<h4>Pattern Recognition</h4>
						<p>
							Look for clusters of mines - they often appear in groups rather
							than being evenly distributed.
						</p>
					</div>
					<div className='tip'>
						<h4>Edge Strategy</h4>
						<p>
							Starting from edges or corners can sometimes be safer in mines
							games.
						</p>
					</div>
					<div className='tip'>
						<h4>Risk Management</h4>
						<p>
							Don't chase losses. Set a limit for yourself before you start
							playing.
						</p>
					</div>
				</div>
			</div>

			<div className='disclaimer'>
				<p>
					This is a pattern generator for educational purposes only. Gambling
					involves risk. Please gamble responsibly and only with money you can
					afford to lose. You must be of legal age to gamble in your
					jurisdiction.
				</p>
			</div>
		</div>
	);
};

export default MinesPatternGenerator;
