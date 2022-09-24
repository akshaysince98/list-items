import React from 'react'
import './item.css'
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

function Listitems(props) {

  const priorityUp = () => {
    props.priorityChange(-1, props.t)
  }
  const priorityDown = () => {
    props.priorityChange(+1, props.t)
  }

  const deleteItems = () => {
    props.deleteText(props.t)
  }

  return (
    <>
      <div className='item'>
        <div className='item-text'> {props.t} </div>
        <div onClick={priorityUp} className={props.i == 0 ? 'end' : 'norm'} > <ArrowDropUpRoundedIcon /> </div>
        <div onClick={priorityDown} className={props.i == props.length - 1 ? 'end' : 'norm'} > <ArrowDropDownRoundedIcon /> </div>
        <div onClick={deleteItems} className="delete"> <ClearRoundedIcon /> </div>
      </div>
    </>
  )
}

export default Listitems
