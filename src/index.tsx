import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

type SquareProps = {
  value: string;
  onClick: (() => void);
};

type BoardProps = {
  squares: string[];
  xIsNext: boolean;
  onClick: ((i: number) => void);
}

type Point = {
  x: number;
  y: number;
}

type History = {
  squares: string[];
  move: Point | null;
};

function Square(props: SquareProps) {
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props: BoardProps) {
  const renderSquare = (i: number) => {
    return (
      <Square
          value={props.squares[i]}
          onClick={() => props.onClick(i)}
      />
    );
  }

  return (
    <div>
      <div className='board-row'>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className='board-row'>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className='board-row'>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useState<History[]>([{
    squares: Array(9).fill(null),
    move: null,
  }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc = move ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button> {step.move ? `(${step.move.x}, ${step.move.y})` : ''}
      </li>
    );
  });

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  const handleClick = (i: number) => {
    const history_ = history.slice(0, stepNumber + 1);
    const current = history_[history_.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(history_.concat(
      {
        squares,
        move: {
          x: Math.floor(i / 3),
          y: i % 3
        },
      }
    ));
    setStepNumber(history_.length);
    setXIsNext(!xIsNext);
  }

  const jumpTo = (step: number) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  }

  return (
    <div className='game'>
      <div className='game-board'>
        <Board
            squares={current.squares}
            xIsNext={xIsNext}
            onClick={(i) => handleClick(i)}
        />
      </div>
      <div className='game-info'>
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Game />);

function calculateWinner(squares: string[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
