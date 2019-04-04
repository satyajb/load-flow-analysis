// canvas container
const stage = new Konva.Stage({
    container: 'canvas',   // id of container <div>
    width: document.getElementById('canvas-container').offsetWidth,
    height: document.getElementById('canvas-container').offsetHeight
});
  
// then create layer
const layer = new Konva.Layer();

// create our shape
const circle = new Konva.Circle({
    x: stage.width() / 2,
    y: stage.height() / 2,
    radius: 70,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4
});

// add the shape to the layer
layer.add(circle);

// add the layer to the stage
stage.add(layer);

// draw the image
layer.draw();
