
export default class TicTacToe {

  grid = [[0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, 0.5]];
  turn = "o";

  formatGrid = () => {
    let output = [];
    for (let row of this.grid) {
      for (let slot of row) {
        if (slot === 0.5) {
          output.push(0);
          output.push(0);
        }
        else if (slot === 1) {
          output.push(1);
          output.push(1)
        }
        else {
          output.push(1);
          output.push(0);
        }
      }
    }
    return output;
  }

  play = (play, player) => {
    let move = play.reduce((acc, cur, ind) => Math.max(acc, cur), 0);
    move = play.indexOf(move);
    let x = (move % 3);
    let y = Math.floor(move / 3);
    x = Math.max(0, Math.min(2, Math.floor(x)));
    y = Math.max(0, Math.min(2, Math.floor(y)));

    // console.log(x, y, this.grid[x][y]);
    if (this.grid[x] === undefined || this.grid[x][y] === undefined) {
      // console.log(x, y);
      // debugger;
      return false;
    }

    if (this.grid[x][y] === 0.5) {
      if (player === "x") {
        this.grid[x][y] = 0;
        this.turn = "o";
      }
      else {
        this.grid[x][y] = 1;
        this.turn = "x";
      }
      return true;
    }
    else {
      // let moves = this.getPossibleMoves();
      // let move = moves[0];
      //
      // let action;
      // if (player === "x") {
      //   action = 0;
      //   this.turn = "o";
      // }
      // else {
      //   action = 1;
      //   this.turn = "x";
      // }
      //
      // this.grid[move[0]][move[1]] = action;

      return false;
    }
  }

  getPossibleMoves = () => {
    return this.grid.reduce((acc, cur, ind) => {
      if (cur[0] === 0.5) {
        acc.push([ind, 0]);
      }
      if (cur[1] === 0.5) {
        acc.push([ind, 1]);
      }
      if (cur[2] === 0.5) {
        acc.push([ind, 2]);
      }
      return acc;
    }, []);
  }

  checkWin = () => {
    if ((this.grid[0][0] === 1 && this.grid[0][0] === this.grid[1][0] && this.grid[0][0] === this.grid[2][0]) ||
        (this.grid[0][1] === 1 && this.grid[0][1] === this.grid[1][1] && this.grid[0][1] === this.grid[2][1]) ||
        (this.grid[0][2] === 1 && this.grid[0][2] === this.grid[1][2] && this.grid[0][2] === this.grid[2][2]) ||
        (this.grid[0][0] === 1 && this.grid[0][0] === this.grid[0][1] && this.grid[0][0] === this.grid[0][2]) ||
        (this.grid[1][0] === 1 && this.grid[1][0] === this.grid[1][1] && this.grid[1][0] === this.grid[1][2]) ||
        (this.grid[2][0] === 1 && this.grid[2][0] === this.grid[2][1] && this.grid[2][0] === this.grid[2][2]) ||
        (this.grid[0][0] === 1 && this.grid[0][0] === this.grid[1][1] && this.grid[0][0] === this.grid[2][2]) ||
        (this.grid[0][2] === 1 && this.grid[0][2] === this.grid[1][1] && this.grid[0][2] === this.grid[2][0])) {
          return "o";
        }
    else if ((this.grid[0][0] === 0 && this.grid[0][0] === this.grid[1][0] && this.grid[0][0] === this.grid[2][0]) ||
        (this.grid[0][1] === 0 && this.grid[0][1] === this.grid[1][1] && this.grid[0][1] === this.grid[2][1]) ||
        (this.grid[0][2] === 0 && this.grid[0][2] === this.grid[1][2] && this.grid[0][2] === this.grid[2][2]) ||
        (this.grid[0][0] === 0 && this.grid[0][0] === this.grid[0][1] && this.grid[0][0] === this.grid[0][2]) ||
        (this.grid[1][0] === 0 && this.grid[1][0] === this.grid[1][1] && this.grid[1][0] === this.grid[1][2]) ||
        (this.grid[2][0] === 0 && this.grid[2][0] === this.grid[2][1] && this.grid[2][0] === this.grid[2][2]) ||
        (this.grid[0][0] === 0 && this.grid[0][0] === this.grid[1][1] && this.grid[0][0] === this.grid[2][2]) ||
        (this.grid[0][2] === 0 && this.grid[0][2] === this.grid[1][1] && this.grid[0][2] === this.grid[2][0])) {
          return "x";
        }
    else {
      return false;
    }
  }

  checkDraw = () => {
    return this.grid[0][0] !== 0.5 && this.grid[0][1] !== 0.5 && this.grid[0][2] !== 0.5 &&
           this.grid[1][0] !== 0.5 && this.grid[1][1] !== 0.5 && this.grid[1][2] !== 0.5 &&
           this.grid[2][0] !== 0.5 && this.grid[2][1] !== 0.5 && this.grid[2][2] !== 0.5
  }
}
