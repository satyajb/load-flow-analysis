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
        // fscanf(fdat, "%d", & k2); ?? what is this ??


        // Psch and Qsch
        let psch = [], qsch = [];
        this.buses.forEach(bus => {
            psch.push((bus.pg - bus.pl) / 100); // 100 being base value
            qsch.push((bus.qg - bus.ql) / 100);
        });

        let kount = 1; // no. of iteration count

//         iteration: // iteration loop..
        let delmax = 0;

        // Pcal and Qcal
        let pcal = [], qcal = [];
        this.buses.forEach(i => {
            let ix = 0, iy = 0;
            this.buses.forEach(j => {
                ix += j.v * (gbus[i][j] * cos(theta[i] - theta[j]) - bbus[i][j] * sin(theta[i] - theta[j]));
                iy += j.v * (gbus[i][j] * sin(theta[i] - theta[j]) + bbus[i][j] * cos(theta[i] - theta[j]));
            });
            
            pcal.push(vbus[i] * ix);
            qcal.push(vbus[i] * iy);
        });

        for (i = 2; i <= nbt; i++) {
            psum = 0.0;
            qsum = 0.0;
            for (j = 1; j <= nbt; j++) {
                psum = psum + vbus[j] * (gbus[i][j] * cos(theta[i] - theta[j]) - bbus[i][j] * sin(theta[i] - theta[j]));
                qsum = qsum + vbus[j] * (gbus[i][j] * sin(theta[i] - theta[j]) + bbus[i][j] * cos(theta[i] - theta[j]));
            }
            pcal[i] = vbus[i] * psum;
            qcal[i] = vbus[i] * qsum;
        }

//         if (kount > 1 && ngbo != 0) {
//             mk1 = 0;
//             for (j = 1; j <= ngbo; j++) {
//                 j3 = nvcbo[j];
//                 if (qcal[j3] < qmin[j3]) {
//                     qcal[j3] = qmin[j3];
//                     qsch[j3] = qcal[j3];
//                     qsch[j3] = qmin[j3];
//                     mk1 = mk1 + 1;
//                 }
//                 else if (qcal[j3] > qmax[j3]) {
//                     qcal[j3] = qmax[j3];
//                     qsch[j3] = qcal[j3];
//                     qsch[j3] = qmax[j3];
//                     mk1++;
//                 }
//                 else {
//                     nvcb[j - mk1] = nvcbo[j];
//                     qsch[j3] = 0;
//                     vbus[j3] = vbusin[j3];
//                 }
//             }

//             ngb = ngbo - mk1;
//         }
//         // delp and delq calculation..
//         if (ngb == 0) {
//             for (i = 2; i <= nbt; i++) {
//                 delp[i] = psch[i] - pcal[i];
//                 delpq[i - 1] = delp[i];
//                 if (fabs(delp[i]) > delmax) {
//                     delmax = fabs(delp[i]);
//                 }
//                 delq[i] = qsch[i] - qcal[i];
//                 delpq[nbt - 1 + i - 1] = delq[i];
//                 if (fabs(delq[i]) > delmax) {
//                     delmax = fabs(delq[i]);
//                 }
//             }
//         } else {
//             jj5 = 0;
//             for (i = 2; i <= nbt; i++) {
//                 delp[i] = psch[i] - pcal[i];
//                 delpq[i - 1] = delp[i];
//                 if (fabs(delp[i]) > delmax) {
//                     delmax = fabs(delp[i]);
//                 }

//                 kk9 = 0;
//                 for (j = 1; j <= ngb; j++) {
//                     if (i == nvcb[j]) {
//                         kk9 = 1;
//                         jj5++;
//                     }
//                 }

//                 if (kk9 == 0) {
//                     delq[i] = qsch[i] - qcal[i];
//                     delpq[nbt - 1 + i - 1 - jj5] = delq[i];
//                     if (fabs(delq[i]) > delmax) {
//                         delmax = fabs(delq[i]);
//                     }
//                 }
//             }
//         }

//         if (delmax < tol) {
//             goto calculate;
//         } else {
//             // Calculation of Elements of Jacobian Matrix..
//             //	Calculation of H-N-M-L
//             if (ngb == 0) { //no voltage controlled bus
//                 for (i = 2; i <= nbt; i++) {
//                     for (j = 2; j <= nbt; j++) {
//                         if (j == i)       //calculation of diagonal elements with no voltage controlled bus
//                         {
//                             ah[i][i] = bbus[i][i] * vbus[i] * vbus[i] - qcal[i];
//                             cn[i][i] = gbus[i][i] * vbus[i] * vbus[i] + pcal[i];
//                             cm[i][i] = -gbus[i][i] * vbus[i] * vbus[i] + pcal[i];
//                             dl[i][i] = bbus[i][i] * vbus[i] * vbus[i] + qcal[i];
//                         }
//                         else           //calculation of off-diagonal elements with no voltage controlled bus
//                         {
//                             ah[i][j] = vbus[i] * vbus[j] * (gbus[i][j] * sin(theta[i] - theta[j]) + bbus[i][j] * cos(theta[i] - theta[j]));
//                             cn[i][j] = vbus[i] * vbus[j] * (gbus[i][j] * cos(theta[i] - theta[j]) - bbus[i][j] * sin(theta[i] - theta[j]));
//                             cm[i][j] = -cn[i][j];
//                             dl[i][j] = ah[i][j];
//                         }
//                     }
//                 }
//             } else { // presence of voltage controlled bus
//                 //calculation of H Elements of Jacobian Matrix
//                 for (i = 2; i <= nbt; i++) {
//                     for (j = 2; j <= nbt; j++) {
//                         if (j == i)          //H matrix diagonal elements
//                             ah[i][i] = bbus[i][i] * vbus[i] * vbus[i] - qcal[i];
//                         else              //H matrix off-diagonal elements
//                             ah[i][j] = vbus[i] * vbus[j] * (gbus[i][j] * sin(theta[i] - theta[j]) + bbus[i][j] * cos(theta[i] - theta[j]));
//                     }
//                 }

//                 //calculation of N Elements of Jacobian Matrix
//                 for (i = 2; i <= nbt; i++) {
//                     for (j = 2; j <= nbt; j++) {
//                         kk1 = 0;
//                         for (k = 1; k <= ngb; k++) {
//                             if (j == nvcb[k])  //If this bus is a voltage controlled bus put kk1=1
//                                 kk1 = 1;
//                         }

//                         if (kk1 == 0) //Bus considered is not a vcb
//                         {
//                             if (j == i)           //calculation of diagonal elements of non vcb bus N elements
//                                 cn[i][i] = gbus[i][i] * vbus[i] * vbus[i] + pcal[i];
//                             else     //calculation of off-diagonal elements of non vcb bus N elements
//                                 cn[i][j] = vbus[i] * vbus[j] * (gbus[i][j] * cos(theta[i] - theta[j]) - bbus[i][j] * sin(theta[i] - theta[j]));
//                         }

//                     }
//                 }

//                 //calculation of M Elements of Jacobian Matrix
//                 for (i = 2; i <= nbt; i++) {
//                     kk2 = 0;
//                     for (k = 1; k <= ngb; k++)
//                         if (i == nvcb[k])  //If this bus is a voltage controlled bus put kk2=1
//                             kk2 = 1;
//                     if (kk2 == 0)         //Bus considered is not a vcb
//                         for (j = 2; j <= nbt; j++)
//                             if (j == i)     //calculation of diagonal elements of non vcb bus M elements     
//                                 cm[i][i] = -gbus[i][i] * vbus[i] * vbus[i] + pcal[i];
//                             else      //calculation of off-diagonal elements of non vcb bus N elements
//                                 cm[i][j] = -vbus[i] * vbus[j] * (gbus[i][j] * cos(theta[i] - theta[j]) - bbus[i][j] * sin(theta[i] - theta[j]));
//                 }

//                 //calcualation of L Elements of Jacobian Matrix
//                 for (i = 2; i <= nbt; i++) {
//                     kk3 = 0;
//                     for (k = 1; k <= ngb; k++)
//                         if (i == nvcb[k])  //If this bus is a voltage controlled bus put kk3=1
//                             kk3 = 1;

//                     if (kk3 == 0)        //Bus considered is not a vcb
//                     {
//                         for (j = 2; j <= nbt; j++) //start of for loop ref:206
//                         {
//                             kk4 = 0;
//                             for (k = 1; k <= ngb; k++)
//                                 if (j == nvcb[k])
//                                     kk4 = 1;
//                             if (kk4 == 0) {
//                                 if (j == i)     //calculation of diagonal elements of non vcb bus L elements     
//                                     dl[i][i] = bbus[i][i] * vbus[i] * vbus[i] + qcal[i];
//                                 else         //calculation of off-diagonal elements of non vcb bus L elements     
//                                     dl[i][j] = vbus[i] * vbus[j] * (gbus[i][j] * sin(theta[i] - theta[j]) + bbus[i][j] * cos(theta[i] - theta[j]));
//                             }    //Bus considered is not a vcb   //end of if condn for kk4=0      
//                         }   //end of for loop ref:206
//                     }//end if condn for kk3=0
//                 }
//             }   //end of else condition for presence of vcb 
//         }

//         // Calculation of Jacobian Matrix when there is no voltage controlled bus
//         if (ngb == 0) {
//             for (i = 2; i <= nbt; i++) {
//                 for (j = 2; j <= nbt; j++) {
//                     ejcbn[i - 1][j - 1] = ah[i][j];
//                     ejcbn[i - 1][nbt - 1 + j - 1] = cn[i][j];
//                     ejcbn[nbt - 1 + i - 1][j - 1] = cm[i][j];
//                     ejcbn[nbt - 1 + i - 1][nbt - 1 + j - 1] = dl[i][j];
//                 }
//             }
//         } else {
//             for (i = 2; i <= nbt; i++)
//                 for (j = 2; j <= nbt; j++) {
//                     ejcbn[i - 1][j - 1] = ah[i][j];
//                 }

//             for (i = 2; i <= nbt; i++) {
//                 jj1 = 0;
//                 for (j = 2; j <= nbt; j++) {
//                     kk5 = 0;
//                     for (k = 1; k <= ngb; k++)
//                         if (j == nvcb[k]) {
//                             kk5 = 1;
//                             jj1 = jj1 + 1;
//                         }

//                     if (kk5 == 0) {
//                         ejcbn[i - 1][nbt - 1 + j - 1 - jj1] = cn[i][j];
//                     }
//                 }
//             }
//             jj2 = 0;
//             for (i = 2; i <= nbt; i++) {
//                 kk6 = 0;
//                 for (k = 1; k <= ngb; k++)
//                     if (i == nvcb[k]) {
//                         kk6 = 1;
//                         jj2 = jj2 + 1;
//                     }
//                 if (kk6 == 0)
//                     for (j = 2; j <= nbt; j++) {
//                         ejcbn[nbt - 1 + i - 1 - jj2][j - 1] = cm[i][j];
//                     }
//             }

//             jj3 = 0;
//             for (i = 2; i <= nbt; i++) {
//                 kk7 = 0;
//                 for (k = 1; k <= ngb; k++)
//                     if (i == nvcb[k]) {
//                         kk7 = 1;
//                         jj3 = jj3 + 1;
//                     }

//                 if (kk7 == 0) {
//                     jj4 = 0;
//                     for (j = 2; j <= nbt; j++) {
//                         kk8 = 0;
//                         for (k = 1; k <= ngb; k++)
//                             if (j == nvcb[k]) {
//                                 kk8 = 1;
//                                 jj4 = jj4 + 1;
//                             }

//                         if (kk8 == 0) {
//                             ejcbn[nbt - 1 + i - 1 - jj3][nbt - 1 + j - 1 - jj4] = dl[i][j];
//                         }
//                     }
//                 }
//             }
//         }

//         // GAUSSIAN ELIMINATION

//         n1 = 2 * (nbt - 1) - ngb;
//         for (k = 1; k <= n1 - 1; k++) {
//             for (i = k + 1; i <= n1; i++) {
//                 delpq[i] = delpq[i] - delpq[k] * ejcbn[i][k] / ejcbn[k][k]; // Modification of delP-Q column matrix Elements
//                 for (j = k + 1; j <= n1; j++) // Modification of Jacobian Matrix Elements 
//                 {
//                     ejcbn[i][j] = ejcbn[i][j] - ejcbn[k][j] * ejcbn[i][k] / ejcbn[k][k];
//                 }
//             }
//         }
//         dlthtv[n1] = delpq[n1] / ejcbn[n1][n1]; //calculation of Theta-V column matrix elements(Extreme last element).
//         for (i = n1 - 1; i > 0; i--) {
//             sum = 0.0;
//             for (j = i + 1; j <= n1; j++) {
//                 sum = sum + ejcbn[i][j] * dlthtv[j];
//             }
//             dlthtv[i] = (delpq[i] - sum) / ejcbn[i][i]; //calculation of Theta-V column matrix elements except Extreme last element
//         }

//         // AFTER GAUSSIAN ELIMINATION
//         // Separation of theta and v from theta-V matrix
//         for (i = 2; i <= nbt; i++)// Separation of deltheta from theta-v matrix
//         {
//             dltht[i] = dlthtv[i - 1];
//         }
//         if (ngb == 0) // Separation of delv from deltheta-v matrix when ngb equals to zero
//         {
//             for (i = 2; i <= nbt; i++) {
//                 delv[i] = dlthtv[nbt - 1 + i - 1];
//             }
//         }
//         else // Separation of delv from deltheta-v matrix when ngb not equals to zero
//         {
//             jj6 = 0;
//             for (i = 2; i <= nbt; i++) {
//                 kk11 = 0;
//                 for (j = 1; j <= ngb; j++)
//                     if (i == nvcb[j]) {
//                         kk11 = 1;
//                         jj6 = jj6 + 1;
//                     }

//                 if (kk11 == 0)
//                     delv[i] = dlthtv[nbt - 1 + i - 1 - jj6];
//             }
//         }


//         for (i = 2; i <= nbt; i++) // New theta calculation
//         {
//             theta[i] = theta[i] + dltht[i];
//             thetad[i] = 180 * theta[i] / 3.141592654;
//         }
//         if (ngb == 0) // New v calculation when ngb is equals to zero.
//         {
//             for (i = 2; i < nbt; i++) {
//                 vbus[i] = vbus[i] + vbus[i] * delv[i];
//             }
//         }
//         else  // New v calculation when ngb is not equals to zero.
//         {
//             for (i = 2; i <= nbt; i++) {
//                 kk12 = 0;
//                 if (i == nvcb[j])
//                     kk12 = 1;

//                 if (kk12 == 0)
//                     vbus[i] = vbus[i] + vbus[i] * delv[i];
//             }
//         }


//         kount = kount + 1;
//         if (kount > 20)
//             goto end;

//   else
//         goto iteration;


//         // Conversion of Polar to Rectangular Coordinates...

//         calculate:
//         for (i = 1; i <= nbt; i++) {
//             realvolt[i] = vbus[i] * cos(theta[i]);
//             imagvolt[i] = vbus[i] * sin(theta[i]);
//             vbusc[i] = realvolt[i] + I * imagvolt[i];
//             conjgbusc[i] = realvolt[i] - I * imagvolt[i];
//         }

        // Calculation of Line Flows..

//         for (i = 1; i <= nl; i++) {
//             m1 = nfb[i];
//             m2 = ntb[i];
//             linef[m1][m2] = 100 * (conjgbusc[m1] * (vbusc[m1] - vbusc[m2]) / (zpla[i] * onr[i]) + conjgbusc[m1] * vbusc[m1] * (yspl[i] + (1 / onr[i]) * (1 / onr[i] - 1) / zpla[i]));

//             linef[m2][m1] = 100 * (conjgbusc[m2] * (vbusc[m2] - vbusc[m1]) / (zpla[i] * onr[i]) + conjgbusc[m2] * vbusc[m2] * (yspl[i] + (1 - 1 / onr[i]) / (zpla[i])));

//         }

    };

    this.fastDecoupled = function () {
        // code of fast-decoupled
    };
}











