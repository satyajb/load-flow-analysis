let canvas = document.getElementById('canvas');

if(canvas.getContext) {
    let ctx = canvas.getContext('2d');
    
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;

    // draw a line
    // ctx.beginPath();
    const line1 = new Path2D();
    line1.moveTo(120, 50);
    line1.lineTo(600, 200);
    ctx.stroke(line1);

    // event listener
    canvas.addEventListener('mousedown', lineStart);
    canvas.addEventListener('mousemove', lineMove);
    canvas.addEventListener('mouseup', lineStop);
    
    let pos = {},
        dragging = false,
        snapshot;
    
    
    function lineStart(e) {

    }

    function lineMove(e) {
        pos = getMousePosition(e);
        // console.log(pos);
        if(ctx.isPointInPath(line1, e.clientX, e.clientY)) {
            ctx.strokeStyle = 'green';
            console.log('true');
        } else {
            ctx.strokeStyle = 'red';
            console.log('false');
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.stroke(line1);
    }

    function lineStop(e) {
        if(dragging) {

        }
    }
    
    function getMousePosition(e) {
        return {
            x: e.clientX - canvas.getBoundingClientRect().left,
            y: e.clientY - canvas.getBoundingClientRect().top
        }
    }

}


    
