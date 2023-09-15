export const drawLine = ({prevPoint, currentPoint, ctx, color}) => {
    const {x: currX, y: currY} = currentPoint
    let startPoint = prevPoint ?? currentPoint
    
    ctx.beginPath();
    if(color == '#FFFFFF00'){
        ctx.globalAlpha = 0;
    }
    else{
        ctx.globalAlpha = 1;
    }
    ctx.lineWidth = 5;
    ctx.strokeStyle = color;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();
    
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2*Math.PI)
    ctx.fill()
}