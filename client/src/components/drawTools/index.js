import React from 'react'
import { ChromePicker } from 'react-color'
import {AiOutlineUndo} from 'react-icons/ai'
import {FaEraser} from 'react-icons/fa6'
import {IoColorPaletteOutline} from 'react-icons/io5'

function DrawTools(props) {
  
  return (
    <div className='rounded-lg bg-black/75 w-[4vw] place-content-evenly flex flex-col h-[12vh] p-[5px]'>
      <div className='flex place-content-evenly'>
        <AiOutlineUndo size={20} onClick = {() => props.socket.emit('undo-stroke', props.room)}/>
        <FaEraser size={20}/>
      </div>
      <div className='flex place-content-evenly'>
        <div className='w-[20px] h-[20px] rounded-[5px]' style = {{backgroundColor: props.color}} onClick={() => props.colorPickerFunction(!props.pickerVisible)}></div>
      </div>
    </div>
  )
}

export default DrawTools