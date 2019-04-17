// canvas container
const contId = 'canvas-container';
const cwidth = document.getElementById(contId).offsetWidth,
    cheight = document.getElementById(contId).offsetHeight;

const stage = new Konva.Stage({
    container: contId,   // id of container <div>
    width: cwidth,
    height: cheight
});
  
// create layer
const layer = new Konva.Layer();

// add layer to the stage
stage.add(layer);

// create shape
const line = new Konva.Line({
    points: [0, 0],
    stroke: 'red',
    strokeWidth: 15,
    lineCap: 'round',
    lineJoin: 'round'
  });


let dragging = false, startPos, endPos;
stage.on('mousedown', function() {
    startPos = stage.getPointerPosition();
    line.points([startPos.x, startPos.y]);
    dragging = true;
    layer.draw();
});

stage.on('mousemove', function() {
    if(dragging) {
        endPos = stage.getPointerPosition();
        line.points([startPos.x, startPos.y, endPos.x, endPos.y]);
        layer.draw();
    }
});

stage.on('mouseup', function() {
    endPos = stage.getPointerPosition();
    line.points([startPos.x, startPos.y, endPos.x, endPos.y]);
    layer.draw();
    
    dragging = false;
});

// add the shape to the layer
layer.add(line);



