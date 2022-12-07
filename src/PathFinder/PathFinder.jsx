import React, { useEffect, useState } from 'react'
import { dijkstra, getNodesInShortestPathOrder, getAllNodes } from '../Algo/Dijkstra'
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
        freeze:false,
        alert:false,
        disable:false,
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
        this.animateDjikstra(visitedNodesInOrder,nodesInShortestPathOrder)
      }
    
    animateDjikstra(visitedNodesInOrder,nodesInShortestPathOrder){
        for(let i=0; i<=visitedNodesInOrder.length;i++){
            if(i===visitedNodesInOrder.length){
                setTimeout(()=>{
                    this.animateShortestPath(nodesInShortestPathOrder)
                },10*i)
            return 
            }
            setTimeout(()=>{
                const node = visitedNodesInOrder[i]
        
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node Visited-node'
        },10 * i )
    }
}

    animateShortestPath(nodesInShortestPathOrder){
        for(let i=0; i<nodesInShortestPathOrder.length; i++){
            setTimeout(()=>{
                const node = nodesInShortestPathOrder[i]
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node shortest-path'
                this.setState({...this.state,alert:true})
            },70*i)
            
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
    const hide = this.state.freeze?"hide":""
    return (
        <div>
            <div className='infoBar'>
                <div className="infoCont">
                    <div>Shortest path</div>
                    <div className="box yellow"></div>
                </div>
                <div className="infoCont">
                    <div>Visited nodes</div>
                    <div className="box visited"></div>
                </div>
                <div className="info"><button className={this.state.disable?"disabled":"able"} onClick={()=>{
                    this.setState({...this.state, freeze:true, disable:true})
                    this.visualizeDijkstra()
                    }} disabled={this.state.disable}>Visualize</button></div>
                <div className="infoCont">
                    <div>Start node</div>
                    <div className="box green"></div>
                </div>
                <div className="infoCont">
                    <div>End node</div>
                    <div className="box red"></div>
                </div>
                <div className="infoCont">
                    <div>wall node</div>
                    <div className="box wall"></div>
                </div>
            </div>
            <div style={{"margin-left":"50px", "color":"green","margin-top":"10px"}}>Create walls by clicking and dragging the mouse over the grid.</div>
            {this.state.alert?<div style={{"margin-left":"50px", "color":"green","margin-top":"10px"}}>Reload the page to try another shortest path!</div>:<></>}
            <div className={`grid ${hide}`}>
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
                    onMouseUp={(row,col)=>this.onMouseUp(row,col)}
                    />
                    )})}
                </div>
            })}
        </div>
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
           isWall: false,
           previousNode : null,
           
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