const ROWS = 10;
const COLS = 10;
const alphabets = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const spreadsheet = [];
const spreadSheetContainer = document.querySelector("#spreadsheet-container");

const exportBtn = document.querySelector("#export-btn");
exportBtn.onclick = () => {
  let csv = "";
  for (let i = 0; i < spreadsheet.length; i++) {
    if (i === 0) continue;
    csv +=
      spreadsheet[i]
        .filter((item) => !item.isHeader)
        .map((item) => item.data)
        .join(",") + "\r\n";
  }

  const csvObj = new Blob([csv]);
  //   console.log("csvObj: ", csvObj);
  const csvUrl = URL.createObjectURL(csvObj);
  //   console.log("csvUrl", csvUrl);

  const a = document.createElement("a");
  a.href = csvUrl;
  a.download = "spreadsheet.csv";
  a.click();
};

class Cell {
  constructor(
    isHeader,
    disabled,
    data,
    row,
    column,
    rowName,
    columnName,
    active = false
  ) {
    this.isHeader = isHeader;
    this.disabled = disabled;
    this.data = data;
    this.row = row;
    this.column = column;
    this.rowName = rowName;
    this.columnName = columnName;
    this.active = active;
  }
}

function initSpreadsheet() {
  for (let i = 0; i < ROWS; i++) {
    const spreadsheetRow = [];
    for (let j = 0; j < COLS; j++) {
      let isHeader = false;
      let disabled = false;
      let cellData = "";

      if (i === 0) {
        isHeader = true;
        disabled = true;
        cellData = alphabets[j - 1];
      }

      if (j === 0) {
        isHeader = true;
        disabled = true;
        cellData = i;
      }

      if (i === 0 && j === 0) {
        isHeader = true;
        disabled = true;
        cellData = "";
      }

      const rowName = i;
      const columnName = alphabets[j - 1];

      const cell = new Cell(
        isHeader,
        disabled,
        cellData,
        i,
        j,
        rowName,
        columnName,
        false
      );

      spreadsheetRow.push(cell);
    }
    spreadsheet.push(spreadsheetRow);
  }
  drawSheet();
}

function drawSheet() {
  for (let i = 0; i < spreadsheet.length; i++) {
    const rowContainerEl = document.createElement("div");
    rowContainerEl.className = "cell-row";

    for (let j = 0; j < spreadsheet[i].length; j++) {
      const cell = spreadsheet[i][j];
      rowContainerEl.append(createCellEl(cell));
    }
    spreadSheetContainer.append(rowContainerEl);
  }
}

function createCellEl(cell) {
  const inputEl = document.createElement("input");
  inputEl.className = "cell";
  inputEl.id = "cell_" + cell.row + cell.column;
  inputEl.value = cell.data;
  inputEl.disabled = cell.disabled;

  if (cell.isHeader) {
    inputEl.classList.add("header");
  }

  inputEl.onclick = () => handleClick(cell);
  inputEl.onchange = (e) => handleChange(cell, e.target.value);

  return inputEl;
}
function clearHeaderActiveStates() {
  const headers = document.querySelectorAll(".header");
  headers.forEach((header) => header.classList.remove("active"));
}

function getElFromRowCol(row, col) {
  return document.querySelector("#cell_" + row + col);
}

function handleClick(cell) {
  clearHeaderActiveStates();
  const columnHeader = spreadsheet[0][cell.column];
  const rowHeader = spreadsheet[cell.row][0];

  const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
  const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);
  columnHeaderEl.classList.add("active");
  rowHeaderEl.classList.add("active");

  document.querySelector("#cell-status").innerHTML =
    cell.columnName + cell.rowName;
}

function handleChange(cell, data) {
  cell.data = data;
}

initSpreadsheet();
