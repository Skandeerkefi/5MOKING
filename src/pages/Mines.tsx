import React from "react";
import { useMinesStore } from "../store/minesStore";
import "./Mines.css";

const Mines: React.FC = () => {
	const {
		numberOfMines,
		numberOfDiamonds,
		betSize,
		multiplier,
		winAmount,
		winningChance,
		minimalIncreaseOnLoss,
		board,
		revealed,
		gameStatus,
		foundDiamonds,
		patternMode,
		setNumberOfMines,
		setNumberOfDiamonds,
		setBetSize,
		setPatternMode,
		generateBoard,
		generateRandomPattern,
		revealCell,
		resetGame,
	} = useMinesStore();

	const handleMinesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value) || 1;
		setNumberOfMines(value);
	};

	const handleDiamondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value) || 1;
		setNumberOfDiamonds(value);
	};

	const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseFloat(e.target.value) || 1;
		setBetSize(value);
	};

	const renderCell = (row: number, col: number) => {
		const isRevealed = revealed[row][col];
		const cellValue = board[row][col];

		if (!isRevealed) {
			return (
				<div className='hidden cell' onClick={() => revealCell(row, col)} />
			);
		}

		switch (cellValue) {
			case "mine":
				return <div className='cell mine'>💣</div>;
			case "diamond":
				return <div className='cell diamond'>💎</div>;
			default:
				return <div className='cell empty' />;
		}
	};

	return (
		<div className='mines-game'>
			<h1>Mines Assistant</h1>

			<div className='pattern-selector'>
				<h3>Pattern Generation:</h3>
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
				{patternMode === "custom" ? (
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
								disabled={gameStatus === "playing"}
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
								disabled={gameStatus === "playing"}
							/>
						</div>
					</>
				) : (
					<div className='random-info'>
						<p>
							Mines: {numberOfMines}, Diamonds: {numberOfDiamonds}
						</p>
						<p>Randomly generated each game</p>
					</div>
				)}

				<div className='control-group'>
					<label htmlFor='bet'>Bet Size:</label>
					<input
						id='bet'
						type='number'
						min='0.1'
						step='0.1'
						value={betSize}
						onChange={handleBetChange}
						disabled={gameStatus === "playing"}
					/>
				</div>

				<button
					onClick={gameStatus === "idle" ? generateBoard : resetGame}
					className='generate-btn'
				>
					{gameStatus === "idle" ? "Generate Mines Board" : "Reset Game"}
				</button>

				<button
					onClick={generateRandomPattern}
					className='random-btn'
					disabled={gameStatus === "playing"}
				>
					Randomize Pattern
				</button>
			</div>

			<div className='multiplier-info'>
				<h2>Multiplier: {multiplier}x</h2>
				<div className='stats'>
					<p>Win Amount: ${winAmount.toFixed(2)}</p>
					<p>Winning Chance: {winningChance.toFixed(2)}%</p>
					<p>Minimal Increase on loss: x{minimalIncreaseOnLoss.toFixed(5)}</p>
				</div>
			</div>

			<div className='game-board'>
				{board.map((row, rowIndex) => (
					<div key={rowIndex} className='board-row'>
						{row.map((_, colIndex) => (
							<div key={colIndex} className='board-cell'>
								{renderCell(rowIndex, colIndex)}
							</div>
						))}
					</div>
				))}
			</div>

			{gameStatus !== "idle" && (
				<div className='game-status'>
					<p>
						{gameStatus === "won" &&
							`Congratulations! You won $${winAmount.toFixed(2)}!`}
						{gameStatus === "lost" && "Game Over! You hit a mine!"}
						{gameStatus === "playing" &&
							`Found: ${foundDiamonds}/${numberOfDiamonds} diamonds`}
					</p>
				</div>
			)}

			<div className='disclaimer'>
				<p>
					This game is free to use. If anyone is trying to sell you this website
					they are scamming you, be aware.
				</p>
			</div>
		</div>
	);
};

export default Mines;
