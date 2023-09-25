const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)

const { Server } = require("socket.io");

const io = new Server(server,{
    cors: {
        origin: '*',
    },
})

type Point = {
    x: number,
    y: number,
}

type DrawLine = {
    prevPoint: Point | null,
    currentPoint: Point
    color: string
    room: string
}

interface DrawingData {
    id: number;
    prevPoint: Point | null;
    currentPoint: Point;
    color: string;
    room: string;
  }
  

// class DrawingDataStore {
// private drawingData: DrawingData[] = [];

// // Add drawing data to the store
// addDrawingData(data: DrawingData): void {
//     this.drawingData.push(data);
// }

// getDrawingDataForRoom(room: string): DrawingData[] {
//     return this.drawingData.filter((data) => data.room === room);
//     }
// }

class DrawingDataStore {
    private strokes: DrawingData[][] = [];
    private currentStroke: DrawingData[] = [];
    private undoneStrokes: DrawingData[][] = [];
  
    // Add a point to the current stroke
    addPointToCurrentStroke(data: DrawingData): void {
      this.currentStroke.push(data);
    }
  
    // End the current stroke and add it to the list of strokes
    endCurrentStroke(): void {
      if (this.currentStroke.length > 0) {
        this.strokes.push([...this.currentStroke]);
        this.currentStroke = [];
      }
    }
  
    // Get all strokes for a specific room
    getStrokesForRoom(room: string): DrawingData[][] {
      return this.strokes.filter((stroke) => stroke[0]?.room === room);
    }
  
    // Undo the last stroke
    undoStroke(): DrawingData[] | null{
      if (this.strokes.length > 0) {
        const undoneStroke = this.strokes.pop();
        
        if (undoneStroke) {
          this.currentStroke = undoneStroke;
          this.undoneStrokes.push(undoneStroke);
          return undoneStroke
        }
      }
      return null;
    }
  }

const drawingStore = new DrawingDataStore();





var roomName = '';

io.on('connection', async (socket : any) => {
    console.log("Connection");
    
    // io.of('/').adapter.on('create-room', (room) => {
    //     socket.join(room)
    //     io.to(socket.id).emit('enter-room', room)
    //     console.log(socket.rooms) 
    //     roomName = room
    // })

    // io.of('/' ).adapter.on('join-room', (room) => {
    //     io.to(socket.id).emit('enter-room', room)
    //     socket.join(room);
    //     console.log(socket.rooms)
    //     roomName = room
    // })

    socket.on('draw-line', ({prevPoint, currentPoint, color, room}: DrawLine) =>{

        const drawingData: DrawingData = {
            id: Date.now(), // You can use a unique ID generator here
            prevPoint,
            currentPoint,
            color,
            room,
            };
    
        drawingStore.addPointToCurrentStroke(drawingData);

        socket.to(room).emit('draw-line', { prevPoint, currentPoint, color })
        console.log(socket.rooms)
    })


    socket.on('end-stroke', () => {
        drawingStore.endCurrentStroke();
    })

    socket.on('undo-stroke', (room: any) => {
        var undoneStroke = drawingStore.undoStroke();
        if(undoneStroke){
            for(let data of undoneStroke){
                var prevPoint = data.prevPoint;
                var currentPoint = data.currentPoint
                var color = data.color
                console.log(color)
                console.log(socket.id)
                io.to(room).emit('erase-line', { prevPoint, currentPoint, color })
            }
        }
    })

    socket.on('join-room', async (room : any) => {
        // io.to(socket.id).emit('enter-room', room)
        await socket.join(room)
        console.log(socket.rooms)
    })

    socket.on('fetch-drawings', async (room : any) => {
        var roomDrawingData = drawingStore.getStrokesForRoom(room);
        if(roomDrawingData){
            for(let stroke of roomDrawingData)  
            {   
                for(let data of stroke){
                
                    var prevPoint = data.prevPoint;
                    var currentPoint = data.currentPoint
                    var color = data.color
                    console.log(color)
                    console.log(socket.id)
                    io.to(socket.id).emit('draw-line', { prevPoint, currentPoint, color })
                }
            }
        }
    })
    
    
})

server.listen(process.env.PORT || 8000, () => {
    console.log('Server Listening on Port 3001')
})
