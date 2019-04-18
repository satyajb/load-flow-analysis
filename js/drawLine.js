let canvas = document.getElementById('canvas');

if(canvas.getContext) {
    let ctx = canvas.getContext('2d');
    
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;

    canvas.addEventListener('mousedown', lineStart);
    canvas.addEventListener('mousemove', lineMove);
    canvas.addEventListener('mouseup', lineStop);
    
    let pos = {},
        dragging = false,
        snapshot;
    
    
    function lineStart(e) {
        dragging = true;
        let startPos = getMousePosition(e);

        pos.x0 = startPos.x;
        pos.y0 = startPos.y;

        takeSnapshot();
    }

    function lineMove(e) {
        if(dragging) {
            retriveSnapshot();

            let movePos = getMousePosition(e);

            pos.x = movePos.x;
            pos.y = movePos.y;

            ctx.beginPath();
            ctx.moveTo(pos.x0, pos.y0);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
    }

    function lineStop(e) {
        if(dragging) {
            retriveSnapshot();
            
            let endPos = getMousePosition(e);

            pos.x = endPos.x;
            pos.y = endPos.y;

            ctx.beginPath();
            ctx.moveTo(pos.x0, pos.y0);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();

            dragging = false;
        }
    }
    
    function getMousePosition(e) {
        return {
            x: e.clientX - canvas.getBoundingClientRect().left,
            y: e.clientY - canvas.getBoundingClientRect().top
        }
    }

    function takeSnapshot() {
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    function retriveSnapshot() {
        ctx.putImageData(snapshot, 0, 0);
    }
}


    
