import React, { useState, useEffect } from "react";
import "@/styles/bingo-game.scss";
import backendService from "@/service/backendService";
import { useAuth } from '@/contexts/auth';

const BingoGame = () => {
  const CALL_INTERVAL = 10; // seconds

  // Game states
  const [timeUntilNextCall, setTimeUntilNextCall] = useState(CALL_INTERVAL);
  const [board, setBoard] = useState(Array(25).fill(null));
  const [clicked, setClicked] = useState(Array(25).fill(false));
  const [canChallenge, setCanChallenge] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [challengeResult, setChallengeResult] = useState(null);
  const [calledNumber, setCalledNumber] = useState(null);
  const [recentCalls, setRecentCalls] = useState([]);
  const [gameIsActive, setGameIsActive] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const [remainingPlayers, setRemainingPlayers] = useState(0);
  const [totalCalled, setTotalCalled] = useState(0);
  const { 
    getCurrentGameState,
    getPlayerCards,
    purchaseCards,
    challengeWin
   } = backendService();
  const { userInfo } = useAuth();

  // Initialize game
  useEffect(() => {
    purchaseNewCard();
    checkGameStatus();
  }, []);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Check if player is in game and get game status
  const checkGameStatus = async () => {
    try {
        const gameState = await getCurrentGameState();
        
        setGameIsActive(gameState.data.is_started && !gameState.data.is_ended);
        setPlayerCount(gameState.data.player_count);
    } catch (error) {
      console.error("Error checking game status:", error);
    }
  };

  // Get or purchase player card
  const getPlayerCard = async () => {
    try {
      const cards = await getPlayerCards(userInfo.walletAddress);
      
      if (cards.data && cards.data.length > 0) {
        const transformedBoard = convertCardToBoard(cards.data);
        setBoard(transformedBoard);
        setClicked(Array(25).fill(false));
      }
    } catch (error) {
      console.error("Error getting player card:", error);
    }
  };

  // Purchase new card
  const purchaseNewCard = async () => {
    try {
      const result = await purchaseCards(userInfo.walletAddress);
    } catch (error) {
      console.error("Error purchasing card:", error);
    }
  };

  // Convert card numbers to board format
  const convertCardToBoard = (numbers) => {
    const transformedArray = numbers.map(value => 
      parseInt(value) === 0 ? "free" : parseInt(value)
    );
    return transformedArray;
  };

  // Fetch called numbers
  const fetchCalledNumber = async () => {
    try {

      const res = await getCurrentGameState();
      const gameState = res.data;
      
      let drawnNumbers = res.data.drawn_numbers;
      
      
      if (drawnNumbers.length > 0) {
        setCalledNumber(drawnNumbers[drawnNumbers.length - 1]);
        setRecentCalls(drawnNumbers.slice(-7, -1));
      }
      setTotalCalled(res.data.drawn_numbers_count)
      setGameIsActive(gameState.is_started && !gameState.is_ended);
      setPlayerCount(gameState.player_count);
    } catch (error) {
      console.error("Error fetching called number:", error);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeUntilNextCall((prev) => {
        if (prev <= 1) {
          fetchCalledNumber();
          return CALL_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // Check for winning combinations
  const checkCanChallenge = (clickedSquares) => {
    // Check rows
    for (let i = 0; i < 25; i += 5) {
      if (clickedSquares.slice(i, i + 5).every((square) => square)) return true;
    }
    // Check columns
    for (let i = 0; i < 5; i++) {
      if ([0, 1, 2, 3, 4].every((j) => clickedSquares[i + j * 5])) return true;
    }
    // Check diagonals
    if ([0, 6, 12, 18, 24].every((i) => clickedSquares[i])) return true;
    if ([4, 8, 12, 16, 20].every((i) => clickedSquares[i])) return true;
    return false;
  };

  // Handle bingo challenge
  const handleChallenge = async () => {
    setIsChecking(true);
    try {
      const {data} = await challengeWin(userInfo.walletAddress);
    if (data) {
      setChallengeResult("success");
    }else {
      setChallengeResult("failed");
    }
      setTimeout(() => {
        setChallengeResult(null);
      }, 3000);
    } catch (error) {
      console.error("Challenge verification failed:", error);
      setChallengeResult("failed");
    } finally {
      setIsChecking(false);
    }
  };

  // Handle square click
  const handleClick = (i) => {
    if (isChecking) return;
    const newClicked = [...clicked];
    newClicked[i] = !newClicked[i];
    setClicked(newClicked);
    setCanChallenge(checkCanChallenge(newClicked));
  };

  // Render board square
  const renderSquare = (i) => {
    const isCalledNumber = board[i] === calledNumber;
    return (
      <button
        className={`bingo-square 
          ${clicked[i] ? "clicked" : ""} 
          ${challengeResult === "success" ? "winner" : ""}
          ${isChecking ? "checking" : ""}
          ${isCalledNumber ? "current-call" : ""}`}
        onClick={() => handleClick(i)}
        disabled={isChecking}
      >
        {board[i]}
      </button>
    );
  };

  return (
    <div className="bingo-game">
      {gameIsActive ? (
        <div className="called-numbers-display">
          <div className="current-call">
            <h2>Current Call</h2>
            <div className="number">{calledNumber}</div>
            <div className="timer">
              <div
                className="timer-bar"
                style={{ width: `${(timeUntilNextCall / CALL_INTERVAL) * 100}%` }}
              ></div>
              <div className="timer-text">
                Next number in: {formatTime(timeUntilNextCall)}
              </div>
            </div>
          </div>
          <div className="recent-calls">
            <h3>Recent Calls</h3>
            <div className="numbers">
              {recentCalls.map((num, index) => (
                <div key={index} className="recent-number">
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div class="waiting-room">
        <div class="waiting-room__container">
          <div class="waiting-room__header">
            <p class="header-text header-text--animated">
              {remainingPlayers > 0 
                ? `Waiting for ${remainingPlayers} more players...`
                : "Waiting for game to start"}
            </p>
            <div class={recentCalls.length > 0  ? "called-container-grid" : "called-container"}>
              {recentCalls.length > 0 && 
                <p class="header-text">Total called : {totalCalled}</p>
              }
              <p class="header-text">Current players: {playerCount}</p>
            </div>
          </div>
        </div>
      </div>
      )}

      {challengeResult === "success" && (
        <div className="win-message">BINGO!</div>
      )}
      {challengeResult === "failed" && (
        <div className="fail-message">Not quite right!</div>
      )}
      
      <div className="bingo-board">
        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} className="board-row">
            {[0, 1, 2, 3, 4].map((col) => renderSquare(row * 5 + col))}
          </div>
        ))}
      </div>
      
      {canChallenge && !isChecking && !challengeResult && (
        <button className="challenge-button" onClick={handleChallenge}>
          Challenge!
        </button>
      )}
      
      {isChecking && (
        <div className="checking-message">Checking your bingo...</div>
      )}
      
      <button
        className="challenge-button"
        onClick={getPlayerCard}
      >
        Get New Card
      </button>
    </div>
  );
};

export default BingoGame;