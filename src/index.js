import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const colCount = 3
    const rowCount = 3
    return (
      <div>
        {[...new Array(rowCount)].map(
          (x, rowIndex) =>
          {
            return (
              <div className="board-row" key={rowIndex}>
                {[...new Array(colCount)].map(
                  (y, colIndex) => 
                    this.renderSquare(rowIndex*colCount + colIndex) 
                  )
                }
              </div>
            )
          })
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colCount: 3,
      rowCount: 3,
      history: [
        {
          squares: Array(9).fill(null),
          moves: []
        }
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const moves = current.moves.slice();
    //const navBolds = current.navBolds.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    const iRow = Math.floor((i) / this.state.colCount) + 1
    const iCol = (i) - ((iRow-1)*this.state.colCount) + 1
    moves[history.length] = [squares[i], i, [iRow, iCol]]
    this.setState({
      history: history.concat([
        {
          squares: squares,
          moves: moves
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    //moves should have subcategories for movePlayer and moveLocation
    //css class formating camelcase
    const moves = history.map((step, move) => {
      const previousMove = step.moves[Math.max(step.moves.length - 1)];
      const desc = move ?
        'Go to move #' + move + ' ' + '[' + previousMove[0] + ' @ (' + previousMove[2] + ')]':
        'Go to game start';
      return (
        <li key={move}>
          <button 
            onClick={() => this.jumpTo(move)} 
            id = {'nav_' + move}
            class = {move === this.state.stepNumber ? 'nav-bold' : 'nav-notbold'}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
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

