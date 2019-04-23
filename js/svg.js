const svg = document.getElementById('my-svg');
const svgns = 'http://www.w3.org/2000/svg';

svg.addEventListener('click', startStop);
svg.addEventListener('mousemove', drag);

let started = false,
    line,
    pos;

function startStop(e) {
    pos = getMousePosition(e);
    if(!started) {
        line = document.createElementNS(svgns, 'line');
        line.setAttributeNS(null, 'x1', pos.x);
        line.setAttributeNS(null, 'y1', pos.y);
        line.setAttributeNS(null, 'x2', pos.x);
        line.setAttributeNS(null, 'y2', pos.y);
        line.setAttributeNS(null, 'stroke', '#3498db');

        svg.appendChild(line);
    } else {
        line.setAttributeNS(null, 'x2', pos.x);
        line.setAttributeNS(null, 'y2', pos.y);
    }
    started = !started;
    
}

function drag(e) {
    if(started) {
        pos = getMousePosition(e);

        line.setAttributeNS(null, 'x2', pos.x);
        line.setAttributeNS(null, 'y2', pos.y);
    }
}

function getMousePosition(e) {
    return {
        x: e.clientX - svg.getBoundingClientRect().left,
        y: e.clientY - svg.getBoundingClientRect().top
    }
}


