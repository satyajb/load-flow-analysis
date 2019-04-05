// dependency: mathjs

function LoadFlowAnalysis(buses, lines, slack_bus, tolerance) {
    this.buses = buses;
    this.lines = lines;
    this.slack_bus = slack_bus;
    this.tolerance = tolerance;

    // formation of Ybus
    let generateYBus = function (lines, buses) {
        let ybus = [];
        lines.forEach(line => {
            let a = math.min(line.from_bus, line.to_bus),
                b = math.max(line.from_bus, line.to_bus),
                zpla = math.complex(line.resistance, line.reactance).inverse(),
                yspl = math.complex(line.conductance, line.susceptance);

            [a, b].forEach(i => {
                [a, b].forEach(j => {
                    if (i > j)
                        return;

                    let _yspl = yspl,
                        _zpla = zpla;
                    if (i !== j) {
                        _yspl = 0;
                        _zpla = zpla.neg();
                    }
                    // check existance
                    let _ex = ybus.findIndex(y => y.row == i && y.column == j);
                    if (_ex == -1) {
                        _ex = ybus.length;
                        ybus.push({});
                    }

                    ybus.splice(_ex, 1, { row: i, column: j, value: math.add(ybus[_ex].value || 0, _zpla, _yspl) });
                });
            });
        });

        return ybus;
    };

    this.getYBus = function () {
        return generateYBus(this.lines, this.buses);
    };

    this.gaussSeidal = function () {
        // (Pp - jQp) / Vp* = Ip = (Sumof[q=1 to n, q!=p] Ypq.Yq) + Ypp. Vp

        const ybus = generateYBus(this.lines, this.buses);

        this.buses.forEach(bus => {
            // calculation of power constant
            // for load buses and fixed_shunt_* buses only
            // (Pp - jQp)/Ypp
            if (bus.type == 'load' || bus.type == 'fixed_shunt_capacitor' || bus.type == 'fixed_shunt_inductor') {
                let power = math.complex(bus.P, bus.Q).conjugate();
                console.log(power);

                let y = ybus.find(i => i.row == bus._id && i.column == bus._id);
                let power_contant = math.divide(power, y.value);
                console.log(power_contant);
            }

            // calculation of admittance contant
            // for all buses except slack bus
            // Ypq / Ypp
            if (this.slack_bus == bus._id) {
                return;
            }

        })
    };

    this.newtonRaphson = function () {
        // b, b1, b2 ..: Bus, i, j: Loop count, p, q: Power
        let kount = 1; // no. of iteration count

        //         iteration: // iteration loop..
        let delmax = 0;

        let pcal = [], qcal = [], delp = [], delq = [];

        this.buses.forEach(b => {
            if (b._id == slack_bus) {
                return;
            }

            let psch = (b.pg - b.pl) / 100,
                qsch = (b.qg - b.ql) / 100; // 100 being base value

            let ia = 0, ir = 0;
            this.buses.forEach(b1 => {
                let y = ybus.find(k => k.row == i && k.column == j);
                ia += b1.volt * (y.value.re * math.cos(b.theta - b1.theta) - y.value.im * math.sin(b.theta - b1.theta));
                ir += b1.volt * (y.value.re * math.sin(b.theta - b1.theta) + y.value.im * math.cos(b.theta - b1.theta));
            });

            let _pcal = b.volt * ia,
                _qcal = b.volt * ir;
            pcal.push(_pcal);
            qcal.push(_qcal);

            let dp = psch - _pcal,
                dq = qsch - _qcal;
            delp.push(dp);
            delq.push(dq);

            delmax = math.max(delmax, math.abs(dp), math.abs(dq));
        });

        if (delmax > tol) {
            let jacobian = [];
            // Elements of Jacobian Matrix
            this.buses.forEach((b, i) => {
                if(b._id == slack_bus) {
                    return;
                }

                let y = ybus.find(k => k.row == i && k.column == i);
                let _p = y.value.re * math.pow(b.volt, 2),
                    _q = y.value.im * math.pow(b.volt, 2);
                jacobian.push(
                    {row: i, column: i, value: _q - qcal[i]},
                    {row: i, column: i, value: _p + pcal[i]},
                    {row: i, column: i, value: -_p + pcal[i]},
                    {row: i, column: i, value: _q + qcal[i]}
                );

                this.buses.forEach((b1, j) => {
                    if(b1._id == slack_bus) {
                        return;
                    }
                    if (i < j) {
                        jacobian.push(
                            {row: i, column: j, value: vbus[i] * vbus[j] * (gbus[i][j] * sin(theta[i] - theta[j]) + bbus[i][j] * cos(theta[i] - theta[j]))},
                            {row: i, column: j, value: vbus[i] * vbus[j] * (gbus[i][j] * cos(theta[i] - theta[j]) - bbus[i][j] * sin(theta[i] - theta[j]));},
                            {row: i, column: j, value: -cn[i][j]},
                            {row: i, column: j, value: ah[i][j]}
                        );
                    }
                }
            }
        }
    };

    this.fastDecoupled = function () {
        // code of fast-decoupled
    };
}











