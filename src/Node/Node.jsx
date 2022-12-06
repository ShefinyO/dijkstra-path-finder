import React from 'react'
import './Node.css'

export default function Node({row,col,isStart, isWall,isFinish, visited,onMouseDown,onMouseEnter,onMouseUp}){
    const property = isStart?"Start-node":isFinish?"Finish-node":isWall?"wall-node":""
  return (
    <div
    id={`node-${row}-${col}`} 
    className={`node ${property}`}
    onMouseDown = {()=>onMouseDown(row,col)}
    onMouseEnter = {()=>onMouseEnter(row,col)}
    onMouseUp = {()=>onMouseUp()}
    ></div>
  )
}
