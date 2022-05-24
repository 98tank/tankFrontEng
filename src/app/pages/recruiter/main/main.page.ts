import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { CandidateData } from 'src/app/models';
import { AuthService, FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit, OnDestroy {
  graphic = false;
  subscription: Subscription = new Subscription();
  public barChartLegend = false;
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData: MultiDataSet = [
    [0, 0, 0, 0] ];
  public doughnutChartLabels: Label[] = ['Misiones activas', 'Mis Candidatos activos', 'Mis Candidatos aceptados', 'Mis Candidatos rechazados'];
  public pieChartColors = [
    {
      backgroundColor: ['#061347', '#ec5e04', '#03a45e', '#e42300'],
    },
  ];

  constructor(
    private auth: AuthService,
    private fs: FirebaseService
  ) { }

  ngOnInit() {
    this.getMyStatistics();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  update() {
    this.getMyStatistics();
  }

  getMyStatistics() {
    this.fs.getColFilter(`missions`, 'status', '==', 'Activa').get().then(res => {
      this.doughnutChartData[0][0] = res.size;
      this.subscription = this.auth.getAuth().subscribe(u => {
        if (u?.uid) {
          let active = 0;
          let hired = 0;
          let rejected = 0;
          this.fs.getColFilter('candidates', 'uid_recruiter', '==', u.uid).get().then(r => {
            if (r.size > 0) {
              let counter = 0;
              r.forEach(d => {
                const c: CandidateData = d.data() as CandidateData;
                if (c.status === 'Activo') { this.doughnutChartData[0][1] = ++active; }
                if (c.status === 'Contratado') { this.doughnutChartData[0][2] = ++hired; }
                if (c.status === 'Descartado') { this.doughnutChartData[0][3] = ++rejected; }
                ++counter;
                if (r.size === counter) { this.graphic = true; }
              });
            } else { this.graphic = true; }
          });
        }
      });
    });
  }

}
