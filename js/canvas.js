// canvas container
const contId = 'canvas-container';
const cwidth = document.getElementById(contId).offsetWidth,
    cheight = document.getElementById(contId).offsetHeight;

const stage = new Konva.Stage({
    container: contId,   // id of container <div>
    width: cwidth,
    height: cheight
});
  
// then create layer
const layer = new Konva.Layer();

// create our shape
const circle = new Konva.Circle({
    x: stage.width() / 2,
    y: stage.height() / 2,
    radius: 70,
    fill: 'magenta',
    stroke: 'indianred',
    strokeWidth: 40
});

// add the shape to the layer
layer.add(circle);

// add the layer to the stage
stage.add(layer);

// draw the image
layer.draw();
