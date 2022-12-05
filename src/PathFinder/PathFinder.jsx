import React, { useEffect, useState } from 'react'
import { dijkstra, getNodesInShortestPathOrder } from '../Algo/Dijkstra'
import Node from '../Node/Node'
import './PathFinder.css'

const START_NODE_ROW = 10
const START_NODE_COL = 25
const FINISH_NODE_COL = 35
const FINISH_NODE_ROW = 10

export default class PathFinder extends React.Component{
    constructor(props){
    super(props);
    this.state = {
        grid: [],
        isMousePressed: false,
    }
    }
    componentDidMount(){
        const grid = getStartingGrid()
        this.setState({...this.state,
                        grid})
      }

    visualizeDijkstra(){
        const {grid} = this.state
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode)
        console.log(visitedNodesInOrder)
        this.animateDjikstra(visitedNodesInOrder)
      }
    
    animateDjikstra(visitedNodesInOrder){
        for(let i=0; i<visitedNodesInOrder.length;i++){
            setTimeout(()=>{
                const node = visitedNodesInOrder[i]
                const newGrid = this.state.grid.slice()
                const newNode = {
                    ...node,
                    visited: true,
                }
                newGrid[node.row][node.col] = newNode
                this.setState({...this.state,grid:newGrid})
                console.log(this.state.grid)
        },100 * i )
    }

}

    onMouseDown(row,col){
        const newGrid = getGridAfterWalled(this.state.grid, row,col)
        this.setState({grid:newGrid, isMousePressed:true})
    }

    onMouseEnter(row,col){
        if(this.state.isMousePressed === false) return;
        const newGrid = getGridAfterWalled(this.state.grid, row,col)
        this.setState({...this.state,grid:newGrid})
    }

    onMouseUp(){
        this.setState({...this.state, isMousePressed:false})
    }
  

  render(){
    return (
        <div className='grid'>
        <button onClick={()=>this.visualizeDijkstra()}>visualize</button>
        <div className='grid2'>
            {this.state.grid.map((row, rowIdx)=>{
                return <div key={rowIdx}>
                    {row.map((node,nodeIdx)=> {
                        const {row,col,isStart,isFinish,visited, isWall} = node
                    return(
                    <Node 
                    key={nodeIdx}
                    row={row}
                    col={col} 
                    isStart={isStart} 
                    isFinish={isFinish}
                    visited={visited}
                    isWall = {isWall}
                    onMouseDown = {(row,col)=>this.onMouseDown(row,col)}
                    onMouseEnter = {(row,col)=>this.onMouseEnter(row,col)}
                    onMouseUp={(row,col)=>this.onMouseUp(row,col)}/>
                    )})}
                </div>
            })}
        </div>
        </div>
      )
}}



const createNode =(row,col)=>{
   return{ col,
           row,
           isStart: col === START_NODE_COL && row === START_NODE_ROW,
           isFinish: col === FINISH_NODE_COL && row === FINISH_NODE_ROW,
           distance: Infinity,
           isVisited : false,
           visited:false,
           previousNode: null,
           isWall: false
        }}

const getStartingGrid = ()=>{        
          const grid= []
        for(let row=0; row<20; row++){
            const currentRow = []
            for(let col=0; col<50; col++){
                currentRow.push(createNode(row,col))
            }
            grid.push(currentRow)
        }
        return grid
}

const getGridAfterWalled=(grid,row,col)=>{
    const newGrid = grid.slice()
    const node = newGrid[row][col]
    const newNode = {
        ...node,
        isWall : !node.isWall
    }

    newGrid[row][col] = newNode
    return newGrid
}