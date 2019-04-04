#include <stdio.h>
#include <complex.h>
#include <float.h>
#include <math.h>
main()
{
    float rkm[50], xkm[50], gkom[50], bkom[50], onr[50], tol, gbus[50][50], bbus[50][50];
    float realvolt[50], imagvolt[50], thetad[100];
    float dltht[50], dlthtv[50], delv[50], sum;
    float delp[50], delpq[50], delq[50], delqq[50], delmax, vbusin[50], thetain[50], vbus[50];
    float theta[50], pg[50], qg[50], pl[50], ql[50], psch[50], qsch[50], psum, qsum, pcal[50];
    float qcal[50], qmaxm, qminm, qmax[50], qmin[50], ah[100][100], cn[100][100], cm[100][100];
    float dl[100][100], ejcbn[50][50];

    complex zpla[50], ypla[50], yspl[50], ybus[50][50], vbusc[50], sloss, pqj[50];
    complex linef[50][50], conjgbusc[50];

    int nvcbo[50], nvcb[50], nlb, nbt, nl, nfb[50], ntb[50], i, j, j1, j2, x, ln[50], l, ngbo, ngb;
    int jj3, jj4, kk7, kk8, n1, n2;
    int jj6, kk11, kk12, m1, m2, m4;
    int jj5, kk9, k2, bn[50], k3, k4, m3, kk10, kount, mk1, j3, kk1, k, kk2, kk3, kk4, jj1, kk5, jj2, kk6;

    FILE *fdat, *fout;
    fdat = fopen("nrlfam.dat", "r");
    fout = fopen("nrlfam.out", "w");

    fscanf(fdat, "%d %d %d %f", &ngbo, &nlb, &nl, &tol);

    ngb = ngbo;
    nbt = ngb + nlb + 1;

    for (i = 1; i <= nl; i++)
    {
        fscanf(fdat, "%d %d %d %f %f %f %f %f", &ln[i], &nfb[i], &ntb[i], &rkm[i], &xkm[i], &gkom[i], &bkom[i], &onr[i]);

        zpla[i] = rkm[i] + I * xkm[i];
        yspl[i] = gkom[i] + I * bkom[i];
        ypla[i] = 1 / zpla[i];
    }
    //FINDING THE Y-BUS MATRIX..

    for (i = 1; i <= nbt; i++)
    {
        for (j = 1; j <= nbt; j++)
        {
            ybus[i][j] = 0;
        }
    }

    for (i = 1; i <= nl; i++)
    {
        j1 = nfb[i];
        j2 = ntb[i];
        ybus[j1][j1] = ybus[j1][j1] + 1 / (zpla[i] * onr[i] * onr[i]) + yspl[i];
        ybus[j2][j2] = ybus[j2][j2] + 1 / (zpla[i]) + yspl[i];
        ybus[j1][j2] = -1 / (zpla[i] * onr[i]);
        ybus[j2][j1] = ybus[j1][j2];
    }

    fprintf(fout, "[Ybus] =\n"); //printing y-bus matrix elements
    for (i = 1; i <= nbt; i++)
    {
        for (j1 = 1; j1 <= nbt; j1++)
        {
            fprintf(fout, "ybus[%d][%d]=%.5f+i(%.5f)\n", i, j1, creal(ybus[i][j1]), -cimag(ybus[i][j1]));

            gbus[i][j1] = creal(ybus[i][j1]);
            bbus[i][j1] = -cimag(ybus[i][j1]);
            // printf(" g[%d][%d] = %f : b[%d][%d] = %f\n", i, j1, gbus[i][j1], i,j1, bbus[i][j1]);
        }
        fprintf(fout, "\n");
    }

    fscanf(fdat, "%d", &k2);
    fprintf(fout, "\n\n");
    if (ngbo == 0) //psch and qsch calculation when no. of generator bus is 0
    {
        for (i = 1; i <= nbt; i++)
        {
            fscanf(fdat, "%d %f %f %f %f %f %f", &bn[i], &vbusin[i], &thetain[i], &pl[i], &ql[i], &pg[i], &qg[i]);
            psch[i] = (pg[i] - pl[i]) / 100; // psch calculation..100 is base value.
            qsch[i] = (qg[i] - ql[i]) / 100; //qsch calculation..100 is base value.
            // printf("%d %f %f %f %f %f %f %f %f\n",bn[i],vbusin[i],thetain[i],pl[i],ql[i],pg[i],qg[i],psch[i],qsch[i]);
            if (i != 1)
                fprintf(fout, "P(sch)[%d]= %f;   Q(sch)[%d]= %f\n", i, psch[i], i, qsch[i]);
        }
    }

    else //psch and qsch calculation when no. of generator bus is not equal to zero
    {
        for (j = 1; j <= ngbo; j++)
        {
            fscanf(fdat, "%d %d %f %f", &k3, &nvcbo[j], &qmaxm, &qminm);

            m3 = nvcbo[j];
            qmax[m3] = qmaxm / 100;
            qmin[m3] = qminm / 100;
            nvcb[j] = nvcbo[j];
        }

        fprintf(fout, "\n");
        for (i = 1; i <= nbt; i++)
        {
            kk10 = 0;
            for (j = 1; j <= ngbo; j++)
            {
                if (i == nvcbo[j])
                    kk10 = 1;
            }
            if (kk10 == 0)
            {
                fscanf(fdat, "%d %f %f %f %f %f %f", &k4, &vbusin[i], &thetain[i], &pl[i], &ql[i], &pg[i], &qg[i]);
                psch[i] = (pg[i] - pl[i]) / 100;
                qsch[i] = (qg[i] - ql[i]) / 100;
                // printf("%d %f %f %f %f %f %f %f %f\n",k4,vbusin[i],thetain[i],pg[i],qg[i],pl[i],ql[i],psch[i],qsch[i]);
                fprintf(fout, "P(sch)[%d]= %f;   Q(sch)[%d]= %f\n", i, psch[i], i, qsch[i]);
            }

            else
            {
                fscanf(fdat, "%d %f %f %f %f %f %f", &k4, &vbusin[i], &thetain[i], &pl[i], &ql[i], &pg[i], &qg[i]);
                psch[i] = (pg[i] - pl[i]) / 100;
                fprintf(fout, "P(sch)[%d]= %f;   Q(sch)[%d]= 0.000000\n", i, psch[i], i);
                // printf("%d %f %f %f %f %f %f %f %f\n",k4,vbusin[i],thetain[i],pg[i],qg[i],pl[i],ql[i],psch[i]);
            } // end of else when kk10!=0.
        }
    } // end of else condition when ngb!=0.

    for (i = 1; i <= nbt; i++)
    {
        vbus[i] = vbusin[i];
        theta[i] = thetain[i];
        // printf("%f %f\n",vbus[i],theta[i]);
    }

    kount = 1; // no. of iteration count..

iteration: // iteration loop..
    delmax = 0.0;

    for (i = 2; i <= nbt; i++) // pcal and qcal calculation..
    {
        psum = 0.0;
        qsum = 0.0;
        for (j = 1; j <= nbt; j++)
        {
            psum = psum + vbus[j] * (gbus[i][j] * cos(theta[i] - theta[j]) - bbus[i][j] * sin(theta[i] - theta[j]));
            qsum = qsum + vbus[j] * (gbus[i][j] * sin(theta[i] - theta[j]) + bbus[i][j] * cos(theta[i] - theta[j]));
            // printf("psum = %f: qsum = %f\n",psum,qsum);
        }
        pcal[i] = vbus[i] * psum;
        qcal[i] = vbus[i] * qsum;
        // printf("\n pcal[%d] = %f: qcal[%d] = %f\n",i,pcal[i],i,qcal[i]);
    }

    if (kount > 1 && ngbo != 0)
    {
        mk1 = 0;
        for (j = 1; j <= ngbo; j++)
        // fprintf(fout,"\n\n\n");
        {
            j3 = nvcbo[j];
            if (qcal[j3] < qmin[j3])
            {
                qcal[j3] = qmin[j3];
                qsch[j3] = qcal[j3];
                qsch[j3] = qmin[j3];
                mk1 = mk1 + 1;
            }
            else if (qcal[j3] > qmax[j3])
            {
                qcal[j3] = qmax[j3];
                qsch[j3] = qcal[j3];
                qsch[j3] = qmax[j3];
                mk1++;
            }
            else
            {
                nvcb[j - mk1] = nvcbo[j];
                qsch[j3] = 0;
                vbus[j3] = vbusin[j3];
            }
        }

        ngb = ngbo - mk1;
    }
    fprintf(fout, "\n\n");
    if (kount == 1)
    {
        fprintf(fout, "Initial P, delP, Q and delQ calculation\n");
    }
    else
    {
        fprintf(fout, "P, delP, Q and delQ calculation after %d iteration\n", kount - 1);
    }
    if (ngb == 0) // delp and delq calculation..
    {
        for (i = 2; i <= nbt; i++)
        {
            delp[i] = psch[i] - pcal[i];
            delpq[i - 1] = delp[i];
            fprintf(fout, "P(cal)[%d]= %f;\n \tdelP[%d]= P(sch)[%d]-P(cal)[%d]= %f\n", i, pcal[i], i, i, i, delp[i]);
            if (fabs(delp[i]) > delmax)
            {
                delmax = fabs(delp[i]);
            }
            delq[i] = qsch[i] - qcal[i];
            delpq[nbt - 1 + i - 1] = delq[i];
            fprintf(fout, "Q(cal)[%d]= %f;\n \tdelQ[%d]= Q(sch)[%d]-Q(cal)[%d]=%f\n", i, qcal[i], i, i, i, delq[i]);
            if (fabs(delq[i]) > delmax)
            {
                delmax = fabs(delq[i]);
            }
        }
    }

    else
    {
        jj5 = 0;
        for (i = 2; i <= nbt; i++)
        {
            delp[i] = psch[i] - pcal[i];
            delpq[i - 1] = delp[i];
            fprintf(fout, "P(cal)[%d]= %f;\n \tdelP[%d]= P(sch)[%d]-P(cal)[%d]= %f\n", i, pcal[i], i, i, i, delp[i]);
            if (fabs(delp[i]) > delmax)
            {
                delmax = fabs(delp[i]);
                //fprintf(fout, "\n delmax one ngb not zero = %f\n", delmax);
            }

            kk9 = 0;
            for (j = 1; j <= ngb; j++)
            {
                if (i == nvcb[j])
                {
                    kk9 = 1;
                    jj5++;
                }
            }

            if (kk9 == 0)
            {
                delq[i] = qsch[i] - qcal[i];
                delpq[nbt - 1 + i - 1 - jj5] = delq[i];
                fprintf(fout, "Q(Cal)[%d]= %f;\n \tdelQ[%d]= Q(sch)[%d]-Q(cal)[%d]=%f\n", i, qcal[i], i, i, i, delq[i]);
                if (fabs(delq[i]) > delmax)
                {
                    delmax = fabs(delq[i]);
                    //fprintf(fout, "\n delmax two ngb not zero = %f\n", delmax);
                }
            }
        }
    }
    if (kount == 1)
    {
        fprintf(fout, "\n Initial delmax = %f\n", delmax); // Maximum difference b/w Sch. and Cal...
    }
    else
    {
        fprintf(fout, "\n delmax after %d operation = %f\n", kount - 1, delmax);
    }

    if (delmax < tol)
    {
        fprintf(fout, "\n RESULTS: \n");
        goto calculate;
    }

    else // Calculation of Elements of Jacobian Matrix..
    {
        //			Calculation of H-N-M-L
        if (ngb == 0) //no voltage controlled bus
        {
            for (i = 2; i <= nbt; i++)
            {
                for (j = 2; j <= nbt; j++)
                {
                    if (j == i) //calculation of diagonal elements with no voltage controlled bus
                    {
                        ah[i][i] = bbus[i][i] * vbus[i] * vbus[i] - qcal[i];
                        cn[i][i] = gbus[i][i] * vbus[i] * vbus[i] + pcal[i];
                        cm[i][i] = -gbus[i][i] * vbus[i] * vbus[i] + pcal[i];
                        dl[i][i] = bbus[i][i] * vbus[i] * vbus[i] + qcal[i];
                    }
                    else //calculation of off-diagonal elements with no voltage controlled bus
                    {
                        ah[i][j] = vbus[i] * vbus[j] * (gbus[i][j] * sin(theta[i] - theta[j]) + bbus[i][j] * cos(theta[i] - theta[j]));
                        cn[i][j] = vbus[i] * vbus[j] * (gbus[i][j] * cos(theta[i] - theta[j]) - bbus[i][j] * sin(theta[i] - theta[j]));
                        cm[i][j] = -cn[i][j];
                        dl[i][j] = ah[i][j];
                    }
                }
            }
        }
        else // presence of voltage controlled bus
        {
            for (i = 2; i <= nbt; i++) //calculation of H Elements of Jacobian Matrix
            {
                for (j = 2; j <= nbt; j++)
                {
                    if (j == i) //H matrix diagonal elements
                        ah[i][i] = bbus[i][i] * vbus[i] * vbus[i] - qcal[i];
                    else //H matrix off-diagonal elements
                        ah[i][j] = vbus[i] * vbus[j] * (gbus[i][j] * sin(theta[i] - theta[j]) + bbus[i][j] * cos(theta[i] - theta[j]));
                }
            }

            for (i = 2; i <= nbt; i++) //calculation of N Elements of Jacobian Matrix
            {
                for (j = 2; j <= nbt; j++)
                {
                    kk1 = 0;
                    for (k = 1; k <= ngb; k++)
                    {
                        if (j == nvcb[k]) //If this bus is a voltage controlled bus put kk1=1
                            kk1 = 1;
                    }

                    if (kk1 == 0) //Bus considered is not a vcb
                    {
                        if (j == i) //calculation of diagonal elements of non vcb bus N elements
                            cn[i][i] = gbus[i][i] * vbus[i] * vbus[i] + pcal[i];
                        else //calculation of off-diagonal elements of non vcb bus N elements
                            cn[i][j] = vbus[i] * vbus[j] * (gbus[i][j] * cos(theta[i] - theta[j]) - bbus[i][j] * sin(theta[i] - theta[j]));
                    }
                }
            }

            for (i = 2; i <= nbt; i++) //calculation of M Elements of Jacobian Matrix
            {
                kk2 = 0;
                for (k = 1; k <= ngb; k++)
                    if (i == nvcb[k]) //If this bus is a voltage controlled bus put kk2=1
                        kk2 = 1;
                if (kk2 == 0) //Bus considered is not a vcb
                    for (j = 2; j <= nbt; j++)
                        if (j == i) //calculation of diagonal elements of non vcb bus M elements
                            cm[i][i] = -gbus[i][i] * vbus[i] * vbus[i] + pcal[i];
                        else //calculation of off-diagonal elements of non vcb bus N elements
                            cm[i][j] = -vbus[i] * vbus[j] * (gbus[i][j] * cos(theta[i] - theta[j]) - bbus[i][j] * sin(theta[i] - theta[j]));
            }

            for (i = 2; i <= nbt; i++) //calcualation of L Elements of Jacobian Matrix
            {
                kk3 = 0;
                for (k = 1; k <= ngb; k++)
                    if (i == nvcb[k]) //If this bus is a voltage controlled bus put kk3=1
                        kk3 = 1;

                if (kk3 == 0) //Bus considered is not a vcb
                {
                    for (j = 2; j <= nbt; j++) //start of for loop ref:206
                    {
                        kk4 = 0;
                        for (k = 1; k <= ngb; k++)
                            if (j == nvcb[k])
                                kk4 = 1;
                        if (kk4 == 0)
                        {
                            if (j == i) //calculation of diagonal elements of non vcb bus L elements
                                dl[i][i] = bbus[i][i] * vbus[i] * vbus[i] + qcal[i];
                            else //calculation of off-diagonal elements of non vcb bus L elements
                                dl[i][j] = vbus[i] * vbus[j] * (gbus[i][j] * sin(theta[i] - theta[j]) + bbus[i][j] * cos(theta[i] - theta[j]));
                        } //Bus considered is not a vcb   //end of if condn for kk4=0
                    }     //end of for loop ref:206
                }         //end if condn for kk3=0
            }
        } //end of else condition for presence of vcb
    }

    // making M and N elements of jacobian matrix zero..
    for (i = 2; i <= nbt; i++)
    {
        for (j = 2; j <= nbt; j++)
        {
            cn[i][j] = 0;
            cm[i][j] = 0;
        }
    }

    if (ngb == 0) // Calculation of Jacobian Matrix when there is no voltage controlled bus
    {
        for (i = 2; i <= nbt; i++)
        {
            for (j = 2; j <= nbt; j++)
            {
                ejcbn[i - 1][j - 1] = ah[i][j];
                ejcbn[i - 1][nbt - 1 + j - 1] = cn[i][j];
                ejcbn[nbt - 1 + i - 1][j - 1] = cm[i][j];
                ejcbn[nbt - 1 + i - 1][nbt - 1 + j - 1] = dl[i][j];
                fprintf(fout, "Jacobian matrix[%d][%d] H = %f\n", i - 1, j - 1, ejcbn[i - 1][j - 1]);
                fprintf(fout, "Jacobian matrix[%d][%d] N = %f\n", i - 1, nbt - 1 + j - 1, ejcbn[i - 1][nbt - 1 + j - 1]);
                fprintf(fout, "Jacobian matrix[%d][%d] M = %f\n", nbt - 1 + i - 1, j - 1, ejcbn[nbt - 1 + i - 1][j - 1]);
                fprintf(fout, "Jacobian matrix[%d][%d] L = %f\n", nbt - 1 + i - 1, nbt - 1 + j - 1, ejcbn[nbt - 1 + i - 1][nbt - 1 + j - 1]);
            }
        }
    }
    else // Calculation of Jacobian Matrix when voltage controlled buses are present
    {
        for (i = 2; i <= nbt; i++)
            for (j = 2; j <= nbt; j++)
            {
                ejcbn[i - 1][j - 1] = ah[i][j];
                fprintf(fout, "Jacobian Matrix [%d][%d] H =%f\n", i - 1, j - 1, ejcbn[i - 1][j - 1]);
            }

        for (i = 2; i <= nbt; i++)
        {
            jj1 = 0;
            for (j = 2; j <= nbt; j++)
            {
                kk5 = 0;
                for (k = 1; k <= ngb; k++)
                    if (j == nvcb[k])
                    {
                        kk5 = 1;
                        jj1 = jj1 + 1;
                    }

                if (kk5 == 0)
                {
                    ejcbn[i - 1][nbt - 1 + j - 1 - jj1] = cn[i][j];
                    fprintf(fout, "Jacobian Matrix [%d][%d] N =%f\n", i - 1, nbt - 1 + j - 1 - jj1, ejcbn[i - 1][nbt - 1 + j - 1 - jj1]);
                }
            }
        }
        jj2 = 0;
        for (i = 2; i <= nbt; i++)
        {
            kk6 = 0;
            for (k = 1; k <= ngb; k++)
                if (i == nvcb[k])
                {
                    kk6 = 1;
                    jj2 = jj2 + 1;
                }
            if (kk6 == 0)
                for (j = 2; j <= nbt; j++)
                {
                    ejcbn[nbt - 1 + i - 1 - jj2][j - 1] = cm[i][j];
                    fprintf(fout, "Jacobian Matrix [%d][%d] M =%f\n", nbt - 1 + i - 1 - jj2, j - 1, ejcbn[nbt - 1 + i - 1 - jj2][j - 1]);
                }
        }

        jj3 = 0;
        for (i = 2; i <= nbt; i++)
        {
            kk7 = 0;
            for (k = 1; k <= ngb; k++)
                if (i == nvcb[k])
                {
                    kk7 = 1;
                    jj3 = jj3 + 1;
                }

            if (kk7 == 0)
            {
                jj4 = 0;
                for (j = 2; j <= nbt; j++)
                {
                    kk8 = 0;
                    for (k = 1; k <= ngb; k++)
                        if (j == nvcb[k])
                        {
                            kk8 = 1;
                            jj4 = jj4 + 1;
                        }

                    if (kk8 == 0)
                    {
                        ejcbn[nbt - 1 + i - 1 - jj3][nbt - 1 + j - 1 - jj4] = dl[i][j];
                        fprintf(fout, "Jacobian Matrix [%d][%d] L =%f\n", nbt - 1 + i - 1 - jj3, nbt - 1 + j - 1 - jj4, ejcbn[nbt - 1 + i - 1 - jj3][nbt - 1 + j - 1 - jj4]);
                    }
                }
            }
        }
    }

    // GAUSSIAN ELIMINATION

    n1 = 2 * (nbt - 1) - ngb;
    for (k = 1; k <= n1 - 1; k++)
    {
        for (i = k + 1; i <= n1; i++)
        {
            delpq[i] = delpq[i] - delpq[k] * ejcbn[i][k] / ejcbn[k][k]; // Modification of delP-Q column matrix Elements
            for (j = k + 1; j <= n1; j++)                               // Modification of Jacobian Matrix Elements
            {
                ejcbn[i][j] = ejcbn[i][j] - ejcbn[k][j] * ejcbn[i][k] / ejcbn[k][k];
            }
        }
    }
    dlthtv[n1] = delpq[n1] / ejcbn[n1][n1]; //calculation of Theta-V column matrix elements(Extreme last element).
    for (i = n1 - 1; i > 0; i--)
    {
        sum = 0.0;
        for (j = i + 1; j <= n1; j++)
        {
            sum = sum + ejcbn[i][j] * dlthtv[j];
        }
        dlthtv[i] = (delpq[i] - sum) / ejcbn[i][i]; //calculation of Theta-V column matrix elements except Extreme last element
    }

    // AFTER GAUSSIAN ELIMINATION
    // Separation of theta and v from theta-V matrix
    for (i = 2; i <= nbt; i++) // Separation of deltheta from theta-v matrix
    {
        dltht[i] = dlthtv[i - 1];
    }
    if (ngb == 0) // Separation of delv from deltheta-v matrix when ngb equals to zero
    {
        for (i = 2; i <= nbt; i++)
        {
            delv[i] = dlthtv[nbt - 1 + i - 1];
        }
    }
    else // Separation of delv from deltheta-v matrix when ngb not equals to zero
    {
        jj6 = 0;
        for (i = 2; i <= nbt; i++)
        {
            kk11 = 0;
            for (j = 1; j <= ngb; j++)
                if (i == nvcb[j])
                {
                    kk11 = 1;
                    jj6 = jj6 + 1;
                }

            if (kk11 == 0)
                delv[i] = dlthtv[nbt - 1 + i - 1 - jj6];
        }
    }

    for (i = 2; i <= nbt; i++) // New theta calculation
    {
        theta[i] = theta[i] + dltht[i];
        thetad[i] = 180 * theta[i] / 3.141592654;
    }
    if (ngb == 0) // New v calculation when ngb is equals to zero.
    {
        for (i = 2; i < nbt; i++)
        {
            vbus[i] = vbus[i] + vbus[i] * delv[i];
        }
    }
    else // New v calculation when ngb is not equals to zero.
    {
        for (i = 2; i <= nbt; i++)
        {
            kk12 = 0;
            if (i == nvcb[j])
                kk12 = 1;

            if (kk12 == 0)
                vbus[i] = vbus[i] + vbus[i] * delv[i];
        }
    }

    fprintf(fout, " Iteration count = %d \n", kount);

    kount = kount + 1;
    if (kount > 20)
        goto end;

    else
        goto iteration;

    // Conversion of Polar to Rectangular Coordinates...

calculate:
    for (i = 2; i <= nbt; i++)
    {
        fprintf(fout, " theta[%d] = %f \n", i, thetad[i]);
    }
    fprintf(fout, "\n\n");
    for (i = 2; i <= nbt; i++)
        fprintf(fout, " vbus[%d] = %f \n", i, vbus[i]);

    for (i = 1; i <= nbt; i++)
    {
        realvolt[i] = vbus[i] * cos(theta[i]);
        imagvolt[i] = vbus[i] * sin(theta[i]);
        vbusc[i] = realvolt[i] + I * imagvolt[i];
        conjgbusc[i] = realvolt[i] - I * imagvolt[i];
    }

    fprintf(fout, "\n\n");

    //Calculation of Line Flows..

    for (i = 1; i <= nl; i++)
    {
        m1 = nfb[i];
        m2 = ntb[i];
        linef[m1][m2] = 100 * (conjgbusc[m1] * (vbusc[m1] - vbusc[m2]) / (zpla[i] * onr[i]) + conjgbusc[m1] * vbusc[m1] * (yspl[i] + (1 / onr[i]) * (1 / onr[i] - 1) / zpla[i]));

        linef[m2][m1] = 100 * (conjgbusc[m2] * (vbusc[m2] - vbusc[m1]) / (zpla[i] * onr[i]) + conjgbusc[m2] * vbusc[m2] * (yspl[i] + (1 - 1 / onr[i]) / (zpla[i])));

        fprintf(fout, "lineflow[%d][%d]=(%f)+i(%f)\n", m1, m2, creal(linef[m1][m2]), -cimag(linef[m1][m2]));
        fprintf(fout, "lineflow[%d][%d]=(%f)+i(%f)\n", m2, m1, creal(linef[m2][m1]), -cimag(linef[m2][m1]));
    }

    fprintf(fout, "no of iterations=%d", kount - 1);
end:
    fprintf(fout, "\n FINAL END");

    fprintf(fout, "\n\n\n");
    fclose(fout);
    fprintf(fout, "output file created \n");
} //END OF PROGRAM//
