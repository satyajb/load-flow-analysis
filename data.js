const num_gen = 0;
const num_load = 4;
const tolerance = 0.001;

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

let ybus = new LoadFlowAnalysis(num_gen, num_load, lines);

document.write('<pre>' + ybus.yBus() + '</pre>');
