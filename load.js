// dependency: mathjs

function LoadFlowAnalysis(buses, lines, slack_bus, tolerance) {
    this.buses = buses;
    this.lines = lines;
    this.slack_bus = slack_bus;
    this.tolerance = tolerance;
    
    // formation of Ybus
    this.yBus = function() {        
        // initialize ybus matrix filled with zeros
        let ybus = Array(this.buses.length).fill().map(() => Array(this.buses.length).fill());

        // create ybus matrix
        this.lines.forEach(function(line) {
            let a = line.from_bus - 1, // bcz of array initialization at 0
                b = line.to_bus - 1,
                zpla = math.complex(line.resistance, line.reactance),
                yspl = math.complex(line.conductance, line.susceptance);

            let _t1 = zpla.inverse();
            if(typeof ybus[b][b] === 'undefined') {
                ybus[b][b] = 0;
            }
            ybus[b][b] = math.add(ybus[b][b], _t1, yspl);
            
            // multiply zpla with onr
            zpla = math.multiply(zpla, line.onr);
            let _t2 = zpla.inverse();
            ybus[a][b] = math.subtract(0, _t2);
            
            // multiply zpla with onr again
            zpla = math.multiply(zpla, line.onr);
            let _t3 = zpla.inverse();
            if(typeof ybus[a][a] === 'undefined') {
                ybus[a][a] = 0;
            }
            ybus[a][a] = math.add(ybus[a][a], _t3, yspl);
        });

        return ybus;
    };
    
    this.gaussSeidal = function() {
        
        this.buses.forEach(function(bus) {
            // calculation of power constant
            // for load buses and fixed_shunt_* buses
            // (Pp - jQp)/Ypp
                if(bus.type == 'load' || bus.type == 'fixed_shunt_capacitor' || bus.type == 'fixed_shunt_inductor') {
                    let power = math.complex(bus.P, -bus.Q);
                    let power_contant = math.divide(power / ybus[bus._id][bus._id]);
                }

            // calculation of admittance contant
            // for all buses except slack bus
            // Ypq / Ypp
            if(this.slack_bus == bus._id) {
                continue;
            }
        
        })
    };
    
    this.newtonRaphson = function() {
        // code of newton raphson
    };
    
    this.fastDecoupled = function() {
        // code of fast-decoupled
    };
}











