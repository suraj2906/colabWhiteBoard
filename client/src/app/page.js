'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';

const socket = io('https://colab-white-board.vercel.app:8080')

export default function Home() {
  const  [joinRoomName, setJoinRoomName] =  useState('')
  const  handleChange = (event) => {
		setJoinRoomName(event.target.value);
	};
  const router = useRouter();

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateRoomId() {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
 
  function createRoom() {
    const roomName = generateRoomId();
    router.push('/' + roomName)
    // socket.emit('join-room', roomName)
  }

  function joinRoom() {
    router.push('/' + joinRoomName)
    // socket.emit('join-room', joinRoomName)
  }


   

  return (
    <div className='flex items-center justify-center flex-col h-[100vh]'>
      <h1 className='mb-[10vh] text-[30px]'>WhiteBoard.io</h1>
      <button className='border-[2px] p-[7px]' onClick={createRoom}>Create Room</button>
      <input type='text' className='bg-black border-[2px] m-[10px]' value={joinRoomName} onChange={handleChange}/>
      <button type='button' className='border-[2px] p-[7px]' onClick={joinRoom}>Join Room</button>
    </div>
  )
}
