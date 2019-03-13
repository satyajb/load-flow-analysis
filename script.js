let canvas = document.getElementById('canvas');

if(canvas.getContext) {
    let ctx = canvas.getContext('2d'),
        cWidth = canvas.width,
        cHeight = canvas.height;

    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 3;

    // let prevX = 0, prevY = 0, currX = 300, currY = 150;

    canvas.addEventListener('mousedown', lineStart);
    canvas.addEventListener('mousemove', lineMove);
    canvas.addEventListener('mouseup', lineStop);
    
    let pos = {},
        dragging = false;
    
    
    function lineStart(e) {
        dragging = true;
        let startPos = getMousePosition(e);

        pos.x0 = startPos.x;
        pos.y0 = startPos.y;

        // ctx.beginPath();
        // ctx.moveTo(pos.x0, pos.y0);
    }

    function lineMove(e) {
        if(dragging) {
            let movePos = getMousePosition(e);

            pos.x = movePos.x;
            pos.y = movePos.y;

            ctx.clearRect(0, 0, cWidth, cHeight);

            ctx.beginPath();
            ctx.moveTo(pos.x0, pos.y0);

            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        
        }
    }

    function lineStop(e) {
        if(dragging) {
            lineMove(e);
            
            dragging = false;
        }
    }
    
    function getMousePosition(e) {
        return {
            x: e.clientX - canvas.getBoundingClientRect().left,
            y: e.clientY - canvas.getBoundingClientRect().top
        }
    }
}


    
