import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import stairDemonstration from './stairDemonstation';
import './PathfindingVisualizer.css';

const START_NODE_ROW = 24;
const START_NODE_COL = 55;
const FINISH_NODE_ROW = 24;
const FINISH_NODE_COL = 15;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }
  stairDemonstration(board) {
    let currentIdX = board.height - 1;
    let currentIdY = 0;
    let relevantStatuses = ["start", "target", "object"];
    while (currentIdX > 0 && currentIdY < board.width) {
      let currentId = `${currentIdX}-${currentIdY}`;
      let currentNode = board.nodes[currentId];
      let currentHTMLNode = document.getElementById(currentId);
      if (!relevantStatuses.includes(currentNode.status)) {
        currentNode.status = "wall";
        board.wallsToAnimate.push(currentHTMLNode);
      }
      currentIdX--;
      currentIdY++;
    }
    while (currentIdX < board.height - 2 && currentIdY < board.width) {
      let currentId = `${currentIdX}-${currentIdY}`;
      let currentNode = board.nodes[currentId];
      let currentHTMLNode = document.getElementById(currentId);
      if (!relevantStatuses.includes(currentNode.status)) {
        currentNode.status = "wall";
        board.wallsToAnimate.push(currentHTMLNode);
      }
      currentIdX++;
      currentIdY++;
    }
    while (currentIdX > 0 && currentIdY < board.width - 1) {
      let currentId = `${currentIdX}-${currentIdY}`;
      let currentNode = board.nodes[currentId];
      let currentHTMLNode = document.getElementById(currentId);
      if (!relevantStatuses.includes(currentNode.status)) {
        currentNode.status = "wall";
        board.wallsToAnimate.push(currentHTMLNode);
      }
      currentIdX--;
      currentIdY++;
    }
  }
  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button >
        <button onClick={() => this.stairDemonstartion()}>
          Stair Demonstartion
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 25; row++) {
    const currentRow = [];
    for (let col = 0; col < 70; col++) {
      if (col % 14 == 0) {
        currentRow.push(createWall(col, row))
      }
      else
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};
const createWall = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: true,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
