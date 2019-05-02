const svg = document.getElementById('my-svg');
// const svgns = 'http://www.w3.org/2000/svg';
// const tool = document.getElementById('tool');

// Events
let started = false;
let line, bus;

svg.addEventListener('click', (ev) => {
    let mp = getMousePosition(ev, svg),
        // mode = tool.options[tool.selectedIndex].value,
        mode = (tool = document.querySelector('input[name="tool"]:checked')) ? tool.value : '',
        targetIsBus = ev.target.classList.contains('bus');

    if (mode == 'line') {
        if (!started && targetIsBus) {
            let _id = generateId();
            line = new Line(_id, svg);
            line.mp = mp;
            line.start();
            started = true;
        } else if (started && !targetIsBus) {
            line.mp = mp;
            line.addPoint();
        } else if (started && targetIsBus) {
            line.mp = mp;
            line.stop();
            started = false;

            // alert('line draw completed')
        } else {
            console.log('Error! Line should start or terminate on a bus. If no bus is available, draw one first.');
        }
    } else if (mode == 'bus') {
        if (!targetIsBus) {
            if (!started) {
                let _id = generateId();
                bus = new Bus(_id, svg);
                bus.mp = mp;
                bus.start();
            } else {
                bus.mp = mp;
                bus.stop();
            }
            started = !started;
        } else {
            console.log('Error! Buses should not start or terminate on another bus');
        }
    } else {
        console.log('Error! No mode is selected');
    }
});



// Constructor function
// Line 
function Line(id, pid) {
    this.id = id;
    this.parentId = pid;

    this.mp = '';

    let startPos, midPos = [], endPos;
    let el = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    el.setAttributeNS(null, 'stroke', '#3498db');
    el.setAttributeNS(null, 'stroke-width', '3');
    el.setAttributeNS(null, 'stroke-linecap', 'round');
    el.setAttributeNS(null, 'fill', 'none');
    el.setAttributeNS(null, 'class', 'line');
    el.setAttributeNS(null, 'id', 'line' + this.id);

    this.start = function () {
        startPos = Object.values(this.mp);
        el.setAttributeNS(null, 'points', startPos);
        this.parentId.appendChild(el);
    }

    this.addPoint = function () {
        midPos.push(Object.values(this.mp));
        let _ps = startPos.concat(midPos);
        el.setAttributeNS(null, 'points', _ps);
    }

    this.stop = function () {
        endPos = Object.values(this.mp);
        let _ps = startPos.concat(midPos, endPos);
        el.setAttributeNS(null, 'points', _ps);
    }
}

// Bus
function Bus(id, pid) {
    this.id = id;
    this.parentId = pid;

    this.mp = '';

    let startPos, endPos;
    let el = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    el.setAttributeNS(null, 'stroke', '#f25757');
    el.setAttributeNS(null, 'stroke-width', '3');
    el.setAttributeNS(null, 'stroke-linecap', 'round');
    el.setAttributeNS(null, 'fill', 'none');
    el.setAttributeNS(null, 'class', 'bus');
    el.setAttributeNS(null, 'id', 'bus' + this.id);

    this.start = function () {
        startPos = Object.values(this.mp);
        el.setAttributeNS(null, 'points', startPos);
        this.parentId.appendChild(el);
    }

    this.stop = function () {
        endPos = Object.values(this.mp);
        let _ps = startPos.concat(endPos);
        el.setAttributeNS(null, 'points', _ps);
    }
}


// utility functions
function getMousePosition(e) {
    return {
        x: e.clientX - svg.getBoundingClientRect().left,
        y: e.clientY - svg.getBoundingClientRect().top
    }
}

function generateId() {
    return new Date().getTime();
}
