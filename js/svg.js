const svg = document.getElementById('my-svg');
const svgns = 'http://www.w3.org/2000/svg';

svg.addEventListener('mousedown', startDrawing);
svg.addEventListener('mousemove', panDrawing);
svg.addEventListener('mouseup', stopDrawing);

// mode selector
let currMode;
function changeMode(e) {
    currMode = e.options[e.selectedIndex].value;
}

const tool = document.getElementById('tool');

// line
let started = false, startPos, endPos,
    elem, mode;

function startDrawing(ev) {
    started = true;
    startPos = getMousePosition(ev);

    mode = tool.options[tool.selectedIndex].value;

    elem = document.createElementNS(svgns, mode);
    elem.setAttributeNS(null, 'stroke', '#3498db');
    
    svg.appendChild(elem);
}

function panDrawing(ev) {
    if(started) {
        endPos = getMousePosition(ev);
        switch(mode) {
            case 'line':
                line(elem, startPos, endPos);
            break;
            
            case 'rect':
                rect(elem, startPos, endPos);
            break;
            
            case 'circle':
                circle(elem, startPos, endPos);
            break;
        }
    }
}

function stopDrawing(ev) {
    started = false;
}

// line
function line(elem, startPos, endPos) {
    elem.setAttributeNS(null, 'x1', startPos.x);
    elem.setAttributeNS(null, 'y1', startPos.y);
    elem.setAttributeNS(null, 'x2', endPos.x);
    elem.setAttributeNS(null, 'y2', endPos.y);
}

// rect
function rect(elem, startPos, endPos) {
    let a = Math.min(startPos.x, endPos.x),
        b = Math.min(startPos.y, endPos.y),
        c = Math.max(startPos.x, endPos.x),
        d = Math.max(startPos.y, endPos.y);

    elem.setAttributeNS(null, 'x', a);
    elem.setAttributeNS(null, 'y', b);
    
    elem.setAttributeNS(null, 'width', c-a);
    elem.setAttributeNS(null, 'height', d-b);
}

// circle
function circle(elem, startPos, endPos) {
    elem.setAttributeNS(null, 'cx', startPos.x);
    elem.setAttributeNS(null, 'cy', startPos.y);


    let r = Math.sqrt((startPos.x - endPos.x) ** 2 + (startPos.y - endPos.y) ** 2);
    elem.setAttributeNS(null, 'r', r);
}

// utility 
function getMousePosition(e) {
    return {
        x: e.clientX - svg.getBoundingClientRect().left,
        y: e.clientY - svg.getBoundingClientRect().top
    }
}


