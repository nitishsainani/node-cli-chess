const ChessGame = require("./models/ChessGame");

let chessGame = new ChessGame(5, 2, 1, 1, 1);
chessGame.startGame().then();
