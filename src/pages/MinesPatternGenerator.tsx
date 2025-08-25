import React, { useState, useEffect } from "react";
import "./Mines.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
type CellType = "mine" | "diamond";
type PatternMode = "random" | "custom";

const MinesPatternGenerator: React.FC = () => {
	const [numberOfMines, setNumberOfMines] = useState<number>(8);
	const [numberOfDiamonds, setNumberOfDiamonds] = useState<number>(17);
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
			actualMines = Math.floor(Math.random() * 24) + 1; // 1-24 mines
			actualDiamonds = Math.floor(Math.random() * 24) + 1; // 1-24 diamonds
		}

		// Ensure total cells do not exceed board size
		const totalCells = BOARD_SIZE * BOARD_SIZE;
		if (actualMines + actualDiamonds > totalCells) {
			actualDiamonds = totalCells - actualMines;
		}

		// Start with all diamonds
		const newBoard: CellType[][] = Array(BOARD_SIZE)
			.fill(null)
			.map(() => Array(BOARD_SIZE).fill("diamond"));

		// Place mines
		let minesPlaced = 0;
		while (minesPlaced < actualMines) {
			const row = Math.floor(Math.random() * BOARD_SIZE);
			const col = Math.floor(Math.random() * BOARD_SIZE);

			if (newBoard[row][col] !== "mine") {
				newBoard[row][col] = "mine";
				minesPlaced++;
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
		setNumberOfDiamonds(Math.min(Math.max(value, 1), 24));
	};

	const renderCell = (cell: CellType) => {
		return cell === "mine" ? (
			<div className='pattern-cell mine'>💣</div>
		) : (
			<div className='pattern-cell diamond'>💎</div>
		);
	};

	const calculateProbability = (row: number, col: number) => {
		// Basic probability: count mines around
		let mineCount = 0;
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
			}
		}

		if (mineCount === 0) return "Safe";
		if (mineCount <= 2) return "Medium risk";
		return "High risk";
	};

	return (
		<div className='mines-pattern-generator'>
			<h1>Mines Pattern Generator</h1>
			<p className='subtitle'>Generate patterns with only mines and diamonds</p>

			<div className='pattern-selector'>
				<h3>Pattern Mode:</h3>
				<div className='pattern-buttons'>
					<button
						className={patternMode === "random" ? "active" : ""}
						onClick={() => setPatternMode("random")}
					>
						Random
					</button>
					<button
						className={patternMode === "custom" ? "active" : ""}
						onClick={() => setPatternMode("custom")}
					>
						Custom
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
								max='24'
								value={numberOfDiamonds}
								onChange={handleDiamondsChange}
							/>
						</div>
					</>
				)}

				<button onClick={generateBoard} className='generate-btn'>
					Generate Pattern
				</button>

				<button onClick={generateRandomPattern} className='random-btn'>
					Randomize
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
												{cell === "mine" ? "💣" : "💎"}
											</div>
										))}
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default MinesPatternGenerator;
