'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';
import SliderPicker from 'react-color';
import { useDraw } from '../hooks/useDraw';
import { io } from 'socket.io-client';
import { drawLine } from '../../../utils/drawLine';
import { eraseLine } from '../../../utils/eraseLine';
import {AiOutlineUndo} from 'react-icons/ai'
import {FaEraser} from 'react-icons/fa6'
import {IoColorPaletteOutline} from 'react-icons/io5'
import DrawTools from '@/components/drawTools';


const socket = io('http://localhost:3001')

export default function Home({ params }) {

  const w = window.innerWidth;
  const h = window.innerHeight;
  const [color, setColor] = useState('#000')
  const [erase, setErase] = useState(false)
  const [chromeVisible, setChromeVisible] = useState(false)

  const {canvasRef, onMouseDown} = useDraw(createLine)  

  const room = params.id;

  useEffect(() => {
    
    socket.emit('join-room', room)
    socket.emit('fetch-drawings', room)

    const ctx = canvasRef.current?.getContext('2d')

    socket.on('draw-line', ({prevPoint, currentPoint, color}) => {
      if(!ctx) return
      drawLine({prevPoint, currentPoint, ctx, color})
    })

    // socket.on('draw-fetched-lines', ({prevPoint, currentPoint, color}) => {
    //   if(!ctx) return
    //   drawLine({prevPoint, currentPoint, ctx, color})
    // })

    socket.on('erase-line', ({prevPoint, currentPoint}) => {
      if(!ctx) return
      eraseLine({prevPoint, currentPoint, ctx})
    })

    
  }, [])

  function createLine({prevPoint, currentPoint, ctx}) {
    socket.emit('draw-line', ({prevPoint, currentPoint, color, room}))
    drawLine({prevPoint, currentPoint, ctx, color})
  }

  

  function endStroke(){
    socket.emit('end-stroke');
  }

  return (
    <div className='w-[100vw] h-[100vh] bg-white whiteGrid'>
      <ChromePicker color={color} onChange={(e) => setColor(e.hex)} className={chromeVisible ? 'absolute' : 'hidden'}/>
      <div className='absolute top-[300px] left-[20px]'>
        {/* <DrawTools color = {color} colorPickerFunction = {setChromeVisible} pickerVisible = {chromeVisible} socket={socket} room={room}/> */}
        <div className='rounded-lg bg-black/75 w-[3.5vw] place-content-evenly flex flex-col h-[7.5vh] p-[5px]'>
          <div className='flex place-content-evenly'>
            <div className='w-[20px] h-[20px] rounded-[5px]' style = {{backgroundColor: color}} onClick={() => setChromeVisible(!chromeVisible)}></div>
            {/* <FaEraser  size = {20} onClick={() => {setColor('#FFFFFF00')}}/> */}
          </div>
        </div>
      </div>
      <canvas onMouseDown={() => {onMouseDown()}} onMouseUp={() => endStroke()} ref={canvasRef} width={w} height={h} id='myCanvas'></canvas>
    </div>
  )
}
