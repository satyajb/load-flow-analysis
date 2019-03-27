let canvaso = document.getElementById('canvas');

if(canvaso.getContext) {
    let ctxo = canvaso.getContext('2d');

    let cont = canvaso.parentNode;

    let cWidth = canvaso.width = cont.clientWidth,
        cHeight = canvaso.height = cont.clientHeight;

    let canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'canvasTemp');
    canvas.width = cWidth;
    canvas.height = cHeight;
    canvas.style.position = 'absolute';
    canvas.style.left = 0;
    canvas.style.top = 0;

    cont.appendChild(canvas);

    let ctx = canvas.getContext('2d');

    ctxo.strokeStyle = ctx.strokeStyle = 'red';
    ctxo.lineWidth = ctx.lineWidth = 3;

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
            // lineMove(e);
            
            dragging = false;

            ctxo.drawImage(canvas, 0, 0);

            ctx.clearRect(0, 0, cWidth, cHeight);
        }
        
    }
    
    function getMousePosition(e) {
        return {
            x: e.clientX - canvas.getBoundingClientRect().left,
            y: e.clientY - canvas.getBoundingClientRect().top
        }
    }
}


    
