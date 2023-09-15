// export const eraseLine = ({prevPoint, currentPoint, ctx}) => {
//     const {x: currX, y: currY} = currentPoint
//     let startPoint = prevPoint ?? currentPoint
    
//     ctx.beginPath();
//     ctx.lineWidth = 5;
//     ctx.strokeStyle = ;
//     ctx.moveTo(startPoint.x, startPoint.y);
//     ctx.lineTo(currX, currY);
    
    
//     ctx.fillStyle = color
//     ctx.beginPath()
//     ctx.arc(startPoint.x, startPoint.y, 2, 0, 2*Math.PI)
//     ctx.fill()
// }

export const eraseLine = ({ prevPoint, currentPoint, ctx }) => {
    const { x: currX, y: currY } = currentPoint;
    let startPoint = prevPoint ?? currentPoint;
  
    // Define the width of the eraser
    const eraserWidth = 3; // You can adjust this value as needed
  
    // Calculate the rectangle to clear based on the eraser width
    const minX = Math.min(startPoint.x, currX) - eraserWidth;
    const minY = Math.min(startPoint.y, currY) - eraserWidth;
    const width = Math.abs(startPoint.x - currX) + 2 * eraserWidth;
    const height = Math.abs(startPoint.y - currY) + 2 * eraserWidth;
  
    // Clear the defined rectangle
    ctx.clearRect(minX, minY, width, height);
  };