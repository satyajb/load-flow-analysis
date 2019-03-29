const tolerance = 0.001; // user defined 
const slack_bus = 2; // user defined : bus _id

const buses = [
    {
        _id: 1,
        type: 'generator',
        P: 15.10,
        Q: 10.00,
        Voltage: '1.06 + j0.0',
        V: 1.06,
        delta: 0,
        Qmin: 1.0,
        Qmax: 12.0
    },
    {
        _id: 2,
        type: 'generator',
        P: 15.10,
        Q: 10.00,
        Voltage: '1.06 + j0.0',
        Qmin: 1.0,
        Qmax: 12.0
    },
    {
        _id: 1,
        type: 'load',
        P: 15.10,
        Q: 10.00,
        Voltage: '1.06 + j0.0',
        Qmin: 1.0,
        Qmax: 12.0
    },
    {
        _id: 1,
        type: 'voltage_controlled',
        P: 15.10,
        Q: 10.00,
        Voltage: '1.06 + j0.0',
        Qmin: 1.0,
        Qmax: 12.0
    },
    {
        _id: 1,
        type: 'fixed_shunt_capacitor',
        P: 15.10,
        Q: 10.00,
        Voltage: '1.06 + j0.0',
        Qmin: 1.0,
        Qmax: 12.0
    },
    {
        _id: 1,
        type: 'fixed_shunt_inductor',
        P: 15.10,
        Q: 10.00,
        Voltage: '1.06 + j0.0',
        Qmin: 1.0,
        Qmax: 12.0
    }
];

const lines = [
    {
        _id: 1,
        from_bus: 1,
        to_bus: 2,
        resistance: 0.02,
        reactance: 0.06,
        conductance: 0.0,
        susceptance: 0.030,
        onr: 1.0,
    },
    {
        _id: 2,
        from_bus: 1,
        to_bus: 3,
        resistance: 0.08,
        reactance: 0.24,
        conductance: 0.0,
        susceptance: 0.025,
        onr: 1.0,
        
    },
    {
        _id: 3,
        from_bus: 2,
        to_bus: 3,
        resistance: 0.06,
        reactance: 0.18,
        conductance: 0.0,
        susceptance: 0.020,
        onr: 1.0,
        
    },
    {
        _id: 4,
        from_bus: 2,
        to_bus: 4,
        resistance: 0.06,
        reactance: 0.18,
        conductance: 0.0,
        susceptance: 0.020,
        onr: 1.0,
        
    },
    {
        _id: 5,
        from_bus: 2,
        to_bus: 5,
        resistance: 0.04,
        reactance: 0.12,
        conductance: 0.0,
        susceptance: 0.015,
        onr: 1.0,
        
    },
    {
        _id: 6,
        from_bus: 3,
        to_bus: 4,
        resistance: 0.01,
        reactance: 0.03,
        conductance: 0.0,
        susceptance: 0.010,
        onr: 1.0,
        
    },
    {
        _id: 7,
        from_bus: 4,
        to_bus: 5,
        resistance: 0.08,
        reactance: 0.24,
        conductance: 0.0,
        susceptance: 0.025,
        onr: 1.0,
        
    }
];

const loadflow = new LoadFlowAnalysis(buses, lines, slack_bus, tolerance);
const ybus = loadflow.yBus();


// printing of ybus
document.write('<pre>');

ybus.forEach((a,i) => {
    document.write(i + ' => <br />');
    a.forEach((b, j) => {
        document.write('&nbsp;&nbsp;&nbsp;&nbsp;' + j + ' => ' + b + '<br />');
    });
});

document.write('</pre>');

const gaussSeidal = loadflow.gaussSeidal();

function newFunction() {
    const test = [];
    test[0] = 'satya';
    test[2] = 'biswas';
    console.log(typeof test[1]);
    test.forEach((t, i) => {
        document.write(i + '=> ' + t + '<br />');
    });
}
