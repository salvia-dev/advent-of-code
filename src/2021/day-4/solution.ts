import type { BingoBoard } from '../../types';

const transposeMatrix = (matrix: number[][]) => {
  return matrix[0].map((_, idx) => matrix.map(row => row[idx]));
};

const formatBoards = (data: string) => {
  const boards = data
    .split('\n\n')
    .splice(1)
    .map(board =>
      board
        .split('\n')
        .map(row => row.replace(/\s+/g, ' ').trim().split(' ').map(Number)),
    );

  return boards.map(board => ({
    rows: board,
    columns: transposeMatrix(board),
  })) as BingoBoard[];
};

const getNextNums = (data: string) => {
  return data.split('\n')[0].split(',').map(Number);
};

// *
export const findFirstWinner = (data: string) => {
  const nums = getNextNums(data);
  let filteredBoards = formatBoards(data);
  let foundWinner: BingoBoard | null = null;
  let lastNum = 0;
  let isWinnerByColumn = false;

  for (const num of nums) {
    const hasBoardWinByColumn = filteredBoards.filter(board =>
      board.columns.find(col => col.every(el => el === -1)),
    );
    const hasBoardWinByRow = filteredBoards.filter(board =>
      board.rows.find(row => row.every(el => el === -1)),
    );
    if (hasBoardWinByColumn.length || hasBoardWinByRow.length) {
      foundWinner = hasBoardWinByColumn[0] || hasBoardWinByRow[0];
      isWinnerByColumn = hasBoardWinByColumn.length ? true : false;
      break;
    }

    filteredBoards = filteredBoards.map(board => ({
      columns: board.columns.map(col => col.map(el => (el === num ? -1 : el))),
      rows: board.rows.map(row => row.map(el => (el === num ? -1 : el))),
    }));
    lastNum = num;
  }

  if (isWinnerByColumn) {
    return (
      foundWinner!.columns
        .flat()
        .filter(el => el !== -1)
        .reduce((x, y) => x + y) * lastNum
    );
  }

  return (
    foundWinner!.rows
      .flat()
      .filter(el => el !== -1)
      .reduce((x, y) => x + y) * lastNum
  );
};

// *
export const findLastWinner = (data: string) => {
  const nums = getNextNums(data);
  const BOARDS_COUNT = formatBoards(data).length;
  let filteredBoards = formatBoards(data);
  let foundWinner: BingoBoard | null = null;
  let lastNum = 0;
  let isWinnerByColumn = false;

  for (const num of nums) {
    const hasBoardWinByColumn = filteredBoards.filter(board =>
      board.columns.some(col => col.every(el => el === -1)),
    );
    const hasBoardWinByRow = filteredBoards.filter(board =>
      board.rows.some(row => row.every(el => el === -1)),
    );
    if (
      hasBoardWinByColumn.length === BOARDS_COUNT ||
      hasBoardWinByRow.length === BOARDS_COUNT
    ) {
      foundWinner =
        hasBoardWinByColumn[BOARDS_COUNT - 1] ||
        hasBoardWinByRow[BOARDS_COUNT - 1];
      isWinnerByColumn =
        hasBoardWinByColumn.length === BOARDS_COUNT ? true : false;
      break;
    }

    filteredBoards = filteredBoards.map(board => ({
      columns: board.columns.map(col => col.map(el => (el === num ? -1 : el))),
      rows: board.rows.map(row => row.map(el => (el === num ? -1 : el))),
    }));
    lastNum = num;
  }

  if (isWinnerByColumn) {
    return (
      foundWinner!.columns
        .flat()
        .filter(el => el !== -1)
        .reduce((x, y) => x + y) * lastNum
    );
  }

  return (
    foundWinner!.rows
      .flat()
      .filter(el => el !== -1)
      .reduce((x, y) => x + y) * lastNum
  );
};
