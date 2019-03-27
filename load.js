// dependency: mathjs

function LoadFlowAnalysis(num_gen, num_load, lines) {
    this.num_gen = num_gen;
    this.num_load = num_load;

    this.lines = lines;
    
    // formation of Ybus
    this.yBus = function() {
        let tot_bus = this.num_gen + this.num_load + 1;
        
        // initialize ybus matrix filled with zeros
        let ybus = Array(tot_bus).fill().map(() => Array(tot_bus).fill(0));
        
        // create ybus matrix
        this.lines.forEach(function(line) {
            let a = line.from_bus - 1, // bcz of array initialization at 0
                b = line.to_bus - 1,
                zpla = math.complex(line.resistance, line.reactance),
                yspl = math.complex(line.conductance, line.susceptance);

            let _t1 = zpla.inverse();            
            ybus[b][b] = math.add(ybus[b][b], _t1, yspl);
            
            // multiply zpla with onr
            zpla = math.multiply(zpla, line.onr);
            let _t2 = zpla.inverse();
            ybus[a][b] = ybus[b][a] = math.subtract(0, _t2);
            
            // multiply zpla with onr again
            zpla = math.multiply(zpla, line.onr);
            let _t3 = zpla.inverse();
            ybus[a][a] = math.add(ybus[a][a], _t3, yspl);
        });

        return ybus;
    };
    
    this.gaussSeidal = function() {
        // code of gauss-seidal
    };
    
    this.newtonRaphson = function() {
        // code of newton raphson
    };
    
    this.fastDecoupled = function() {
        // code of fast-decoupled
    };
}











