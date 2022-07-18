exports.CHARACTERS = {
  PAWN: {
    NOTATION: "P",
    MOVES: {
      F: { FINAL_POSITION: [1, 0], KILLS: [[1, 0]] },
      B: { FINAL_POSITION: [-1, 0], KILLS: [[-1, 0]] },
      R: { FINAL_POSITION: [0, 1], KILLS: [[0, 1]] },
      L: { FINAL_POSITION: [0, -1], KILLS: [[0, -1]] },
    },
  },
  HERO1: {
    NOTATION: "H1",
    MOVES: {
      F: {
        FINAL_POSITION: [2, 0],
        KILLS: [
          [1, 0],
          [2, 0],
        ],
      },
      B: {
        FINAL_POSITION: [-2, 0],
        KILLS: [
          [-1, 0],
          [-2, 0],
        ],
      },
      R: {
        FINAL_POSITION: [0, 2],
        KILLS: [
          [0, 1],
          [0, 2],
        ],
      },
      L: {
        FINAL_POSITION: [0, -2],
        KILLS: [
          [0, -1],
          [0, -2],
        ],
      },
    },
  },
  HERO2: {
    NOTATION: "H2",
    MOVES: {
      FR: {
        FINAL_POSITION: [2, 2],
        KILLS: [
          [1, 1],
          [2, 2],
        ],
      },
      FL: {
        FINAL_POSITION: [2, -2],
        KILLS: [
          [1, -1],
          [2, -2],
        ],
      },
      BR: {
        FINAL_POSITION: [-2, 2],
        KILLS: [
          [-1, 1],
          [-2, 2],
        ],
      },
      BL: {
        FINAL_POSITION: [-2, -2],
        KILLS: [
          [-1, -1],
          [-2, -2],
        ],
      },
    },
  },
  HERO3: {
    NOTATION: "H3",
    MOVES: {
      FR: { FINAL_POSITION: [2, 1], KILLS: [[2, 1]] },
      FL: { FINAL_POSITION: [2, -1], KILLS: [[2, -1]] },
      BR: { FINAL_POSITION: [-2, 1], KILLS: [[-2, 1]] },
      BL: { FINAL_POSITION: [-2, -1], KILLS: [[-2, -1]] },
      LR: { FINAL_POSITION: [1, -2], KILLS: [[1, -2]] },
      LL: { FINAL_POSITION: [-1, -2], KILLS: [[-1, -2]] },
      RL: { FINAL_POSITION: [1, 2], KILLS: [[1, 2]] },
      RR: { FINAL_POSITION: [-1, 2], KILLS: [[-1, 2]] },
    },
  },
};
