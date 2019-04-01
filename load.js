// dependency: mathjs

function LoadFlowAnalysis(buses, lines, slack_bus, tolerance) {
    this.buses = buses;
    this.lines = lines;
    this.slack_bus = slack_bus;
    this.tolerance = tolerance;
    
    // formation of Ybus
    let generateYBus = function(lines, buses) {
        let ybus = [];
        lines.forEach(line => {
            let a = math.min(line.from_bus, line.to_bus),
                b = math.max(line.from_bus, line.to_bus),
                zpla = math.complex(line.resistance, line.reactance).inverse(),
                yspl = math.complex(line.conductance, line.susceptance);
            
            [a, b].forEach(i => {
                [a, b].forEach(j => {
                    if(i > j)
                        return;
                    
                    let _yspl = yspl,
                        _zpla = zpla;
                    if(i !== j) {
                        _yspl = 0;
                        _zpla = zpla.neg();
                    }
                    // check existance
                    let _ex = ybus.findIndex(y => y.row == i && y.column == j);
                    if(_ex == -1) {
                        _ex = ybus.length;
                        ybus.push({});
                    }

                    ybus.splice(_ex, 1, {row: i, column: j, value: math.add(ybus[_ex].value || 0, _zpla, _yspl)});
                });
            });
        });

        return ybus;
    };
    
    this.getYBus = function () {
        return generateYBus(this.lines, this.buses);
    };

    this.gaussSeidal = function() {
        // (Pp - jQp) / Vp* = Ip = (Sumof[q=1 to n, q!=p] Ypq.Yq) + Ypp. Vp
        
        const ybus = generateYBus(this.lines, this.buses);
        
        this.buses.forEach(bus => {
            // calculation of power constant
            // for load buses and fixed_shunt_* buses only
            // (Pp - jQp)/Ypp
            if(bus.type == 'load' || bus.type == 'fixed_shunt_capacitor' || bus.type == 'fixed_shunt_inductor') {
                let power = math.complex(bus.P, bus.Q).conjugate();
                console.log(power);

                let y = ybus.find(i => i.row == bus._id && i.column == bus._id);
                let power_contant = math.divide(power, y.value);
                console.log(power_contant);
            }

            // calculation of admittance contant
            // for all buses except slack bus
            // Ypq / Ypp
            if(this.slack_bus == bus._id) {
                return;
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











