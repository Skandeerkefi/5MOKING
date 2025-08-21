import React from "react";
import { useMinesStore } from "../store/minesStore";
import "./Mines.css";

const Mines: React.FC = () => {
	const {
		numberOfMines,
		betSize,
		multiplier,
		winAmount,
		winningChance,
		minimalIncreaseOnLoss,
		board,
		revealed,
		gameStatus,
		totalDiamonds,
		foundDiamonds,
		setNumberOfMines,
		setBetSize,
		generateBoard,
		revealCell,
		resetGame,
	} = useMinesStore();

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

			<div className='game-controls'>
				<div className='control-group'>
					<label htmlFor='mines'>Number of Mines:</label>
					<input
						id='mines'
						type='number'
						min='1'
						max='24'
						value={numberOfMines}
						onChange={(e) => setNumberOfMines(parseInt(e.target.value) || 1)}
						disabled={gameStatus === "playing"}
					/>
				</div>

				<div className='control-group'>
					<label htmlFor='bet'>Bet Size:</label>
					<input
						id='bet'
						type='number'
						min='1'
						step='0.5'
						value={betSize}
						onChange={(e) => setBetSize(parseFloat(e.target.value) || 1)}
						disabled={gameStatus === "playing"}
					/>
				</div>

				<div className='control-group'>
					<label>Number of Diamonds: ({totalDiamonds})</label>
				</div>

				<button
					onClick={gameStatus === "idle" ? generateBoard : resetGame}
					className='generate-btn'
				>
					{gameStatus === "idle" ? "Generate Mines Board" : "Reset Game"}
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
						{gameStatus === "won" && "Congratulations! You won!"}
						{gameStatus === "lost" && "Game Over! You hit a mine!"}
						{gameStatus === "playing" &&
							`Found: ${foundDiamonds}/${totalDiamonds} diamonds`}
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
