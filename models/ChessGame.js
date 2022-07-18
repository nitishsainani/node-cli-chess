const inquirer = require("inquirer");
const { table } = require("table");
const { CHARACTERS } = require("../constants");

module.exports = class ChessGame {
  constructor(
    boardSize,
    maxPawns = 3,
    maxHero1 = 2,
    maxHero2 = 2,
    maxHero3 = 2
  ) {
    // chess grid is Nested List of Strings
    this._chessBoard = [...Array(boardSize)].map(() => [
      ...Array(boardSize).fill(""),
    ]);
    this.boardSize = boardSize;
    this.maxPawns = maxPawns;
    this.maxHero1 = maxHero1;
    this.maxHero2 = maxHero2;
    this.maxHero3 = maxHero3;
  }

  startGame = async () => {
    await this.setInitialArrangement();

    console.log("Game Starting");
    this.printBoard();
    while (true) {
      await this.playerAMove();
      if (this.checkIfPlayerWins("A")) {
        this.endGameLog("A");
        return;
      }

      await this.playerBMove();
      if (this.checkIfPlayerWins("B")) {
        this.endGameLog("B");
        return;
      }
    }
  };

  endGameLog = (winnerPlayerNotation) => {
    console.log("----------------------------");
    console.log("WINNER WINNER CHICKEN DINNER");
    console.log("----------------------------");
    console.log(`Player${winnerPlayerNotation} wins`);
  };

  checkIfPlayerWins = (playerNotation) => {
    let playerCheckNotation = playerNotation === "A" ? "B" : "A";

    for (let row = 0; row < this.boardSize; ++row) {
      for (let col = 0; col < this.boardSize; ++col) {
        if (this._chessBoard[row][col].split("-")[0] === playerCheckNotation) {
          return false;
        }
      }
    }
    return true;
  };

  playerBMove = async () => {
    // Player B Move
    let { playerBMove } = await inquirer.prompt([
      {
        name: "playerBMove",
        type: "input",
        message: `Enter Player B Move:`,
        validate: (inputString) => this.validateMove("B", inputString),
      },
    ]);

    let { characterName, characterNumber, row, col, kills, finalPosition } =
      this.parseAndValidateMoveNotation("B", playerBMove);

    this._chessBoard[row][col] = "";
    for (let [killRow, killCol] of kills) {
      this._chessBoard[killRow][killCol] = "";
    }
    this._chessBoard[finalPosition[0]][finalPosition[1]] = this.getCellNotation(
      "B",
      characterName,
      characterNumber
    );
    this.printBoard();
  };

  playerAMove = async () => {
    let { playerAMove } = await inquirer.prompt([
      {
        name: "playerAMove",
        type: "input",
        message: `Enter Player A Move:`,
        validate: (inputString) => this.validateMove("A", inputString),
      },
    ]);

    let { characterName, characterNumber, row, col, kills, finalPosition } =
      this.parseAndValidateMoveNotation("A", playerAMove);
    this._chessBoard[row][col] = "";
    for (let [killRow, killCol] of kills) {
      this._chessBoard[killRow][killCol] = "";
    }
    this._chessBoard[finalPosition[0]][finalPosition[1]] = this.getCellNotation(
      "A",
      characterName,
      characterNumber
    );
    this.printBoard();
  };

  validateMove = (playerNotation, inputString) => {
    this.parseAndValidateMoveNotation(playerNotation, inputString);
    return true;
  };

  parseCellNotation = (row, col) => {
    let notation = this._chessBoard[row][col];
    let [playerNotation, characterName, characterNumber] = notation.split("-");
    return { playerNotation, characterName, characterNumber };
  };

  parseAndValidateMoveNotation = (playerNotation, inputString) => {
    let [characterNameAndNumber, moveNotation] = inputString
      .trim()
      .split(":")
      .map((e) => e.trim());

    let [characterName, characterNumber] = characterNameAndNumber.split("-");

    let { row, col } = this.findPosition(
      playerNotation,
      characterNameAndNumber
    );
    if (row === -1 || col === -1) throw Error("Invalid Position!");

    moveNotation = moveNotation.toUpperCase();
    if (!Object.keys(CHARACTERS[characterName].MOVES).includes(moveNotation))
      throw Error("Invalid Move!");

    let moveOptions = CHARACTERS[characterName].MOVES[moveNotation];

    let finalPosition;
    if (playerNotation === "A") {
      finalPosition = [
        row + moveOptions.FINAL_POSITION[0],
        col + moveOptions.FINAL_POSITION[1],
      ];
    } else {
      finalPosition = [
        row - moveOptions.FINAL_POSITION[0],
        col - moveOptions.FINAL_POSITION[1],
      ];
    }

    if (!this.isValidBoardPosition(...finalPosition)) {
      throw Error("Invalid Move!");
    }

    let kills = [];
    moveOptions.KILLS.forEach(([relativeRow, relativeCol]) => {
      let currentPosition;
      if (playerNotation === "A") {
        currentPosition = [row + relativeRow, col + relativeCol];
      } else {
        currentPosition = [row - relativeRow, col - relativeCol];
      }

      let currentCellObject = this.parseCellNotation(...currentPosition);
      if (playerNotation === currentCellObject.playerNotation)
        throw Error("Can't Kill your Own Player");
      kills.push(currentPosition);
    });

    return { characterName, characterNumber, row, col, kills, finalPosition };
  };

  printBoard = () => {
    let chessBoardPrintFormat = [];

    for (let row = this.boardSize - 1; row >= 0; --row) {
      let rowObj = [row + 1];
      for (let col = 0; col < this.boardSize; ++col) {
        rowObj.push(this._chessBoard[row][col]);
      }
      chessBoardPrintFormat.push(rowObj);
    }

    let labelRow = ["*"].concat(
      [...Array(this.boardSize)].map((value, index) => index + 1)
    );
    chessBoardPrintFormat.push(labelRow);

    console.table(
      table(chessBoardPrintFormat, {
        columnDefault: { width: 10, alignment: "center" },
        columns: { 0: { width: 5 } },
      })
    );
  };

  findPosition = (playerNotation, characterAndCharacterNumber) => {
    let boardNotation = `${playerNotation}-${characterAndCharacterNumber}`;
    for (let row = 0; row < this.boardSize; ++row) {
      for (let col = 0; col < this.boardSize; ++col) {
        if (this._chessBoard[row][col] === boardNotation) {
          return { row, col };
        }
      }
    }
    return { row: -1, col: -1 };
  };

  getCellNotation = (playerNotation, character, characterNumber) => {
    return `${playerNotation}-${character}-${characterNumber}`;
  };

  isValidBoardPosition = (row, col) => {
    return row < this.boardSize && row >= 0 && col < this.boardSize && col >= 0;
  };

  isInputNotationValid = (inputString) => {
    let inputRow, inputColumn;

    [inputColumn, inputRow] = inputString
      .split(" ")
      .map((strNum) => parseInt(strNum));
    if (inputRow == null || inputColumn == null) {
      // separates out null and undefined
      throw Error("Cannot Split Write Space separated row column");
    }

    if (!this.isValidBoardPosition(inputRow - 1, inputColumn - 1))
      throw Error("Invalid Values! Write Values that Fit into the board");

    if (!!this._chessBoard[inputRow - 1][inputColumn - 1])
      throw Error("Invalid Values! Already a piece Present");
    return true;
  };

  setInitialArrangement = async () => {
    let initialArrangement = {
      PAWN: this.maxPawns,
      HERO1: this.maxHero1,
      HERO2: this.maxHero2,
      HERO3: this.maxHero3,
    };
    this.printBoard();
    for (let character in initialArrangement) {
      let maxCharacters = initialArrangement[character];
      for (let i = 0; i < maxCharacters; ++i) {
        let { playerAInput } = await inquirer.prompt([
          {
            name: "playerAInput",
            type: "input",
            message: `Enter Player A ${character} ${i + 1} Position:`,
            validate: this.isInputNotationValid,
          },
        ]);

        let [playerAInputCol, playerAInputRow] = playerAInput
          .split(" ")
          .map((strNum) => parseInt(strNum.trim()));

        this._chessBoard[playerAInputRow - 1][playerAInputCol - 1] =
          this.getCellNotation("A", character, i + 1);
        this.printBoard();

        let { playerBInput } = await inquirer.prompt([
          {
            name: "playerBInput",
            type: "input",
            message: `Enter Player B ${character} ${i + 1} Position:`,
            validate: this.isInputNotationValid,
          },
        ]);

        let [playerBInputCol, playerBInputRow] = playerBInput
          .split(" ")
          .map((strNum) => parseInt(strNum.trim()));

        this._chessBoard[playerBInputRow - 1][playerBInputCol - 1] =
          this.getCellNotation("B", character, i + 1);
        this.printBoard();
      }
    }
  };
};
