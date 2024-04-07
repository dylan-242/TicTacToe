import { useState } from "react";

export default function Game() {
  const [moves, setMoveHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentBoardLayout = moves[currentMove];

  // console.log(moves);

  function handlePlay(squaresCopy) {
    const nextHistory = [...moves.slice(0, currentMove + 1), squaresCopy]
    setMoveHistory(nextHistory); // copies the arr and adds everything that is in squaresCopy
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);

  }

  const plays = moves.map((squares, indexOfPlay) => { //.map works like enumerate in Python, where we get the element and the index -- squares in this case is the element and index is the index of that particular element
    // on each rerender React will only update the DOM with new elements (underlying mechanics know which elements have already been rendered)
    let description;
    
    if (indexOfPlay > 0)  {
      description = `Jump to move #${indexOfPlay}`
    } else {
      description = `This is the first play`
    }

    //react will throw a key error if a key is not assigned to the list; keys are useful for changes within a list, ex. insertion, deletion, reordering

    return (
      <li key={indexOfPlay}> 
        <button onClick={() => jumpTo(indexOfPlay)}>{description}</button>
      </li>
    );

  });


  return (
    <>
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentBoardLayout} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{plays}</ol>
      </div>
    </div>

    </>
  );
}

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>{value}</button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    const squaresCopy = squares.slice(); //.slice() creates a (shallow) copy of the arr

    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    
    if (xIsNext) {
      squaresCopy[i] = 'X';
    } else {
      squaresCopy[i] = 'O';
    }

    onPlay(squaresCopy);
  }
  
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner is ${winner}`
  } else {
    status = `Next player is ${xIsNext ? 'X':'O'}`
    //this is a concise way to write an if-else statement
    //it follows the format
    //condition ? valueIfTrue : valueIfFalse

  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
  
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
   
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
    </>
  );
}

function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}