import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { MissionData } from 'src/app/models';
import { AuthService, FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  graphic = false;
  subscription: Subscription = new Subscription();
  public barChartLegend = false;
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData: MultiDataSet = [ [0, 0, 0, 0, 0, 0] ];
  public doughnutChartLabels: Label[] = ['Misiones creadas', 'Misiones en revisión', 'Misiones activas', 'Misiones culminadas', 'Candidatos aceptados', 'Candidatos rechazados'];
  public pieChartColors = [ { backgroundColor: ['#061347', '#a8a8a8', '#ec5e04', '#8dbdd8', '#03a45e', '#e42300'], }, ];

  constructor(
    private auth: AuthService,
    private fs: FirebaseService
  ) { }

  ngOnInit() {
    this.getMyStatistics();
  }

  update() {
    this.getMyStatistics();
  }

  getMyStatistics() {
    this.subscription = this.auth.getAuth().subscribe(u => {
      if (u?.uid) {
        let active = 0;
        let review = 0;
        let completed = 0;
        this.fs.getColFilter(`missions`, 'uid', '==', u.uid).get().then(r => {
          this.doughnutChartData[0][0] = r.size;
          if (r.size > 0) {
            let counter = 0;
            r.forEach(d => {
              const m: MissionData = d.data() as MissionData;
              if (m.status === 'Pendiente') { this.doughnutChartData[0][1] = ++review; }
              if (m.status === 'Activa') { this.doughnutChartData[0][2] = ++active; }
              if (m.status === 'Completada') { this.doughnutChartData[0][3] = ++completed; }
              ++counter;
              if (r.size === counter) { this.getMyMissions(u.uid); }
            });
          } else { this.getMyMissions(u.uid); }
        });
      }
    });
  }

  getMyMissions(uid: string) {
    this.fs.getColFilter('missions', 'uid', '==', uid).get().then(res => {
      const m: string[] = [''];
      if (res.size > 0) {
        let counter = 0;
        res.forEach(d => {
          ++counter;
          m.push(d.id);
          if (res.size === counter) { this.getCandidatesInMyMissions(m); }
        });
      } else { this.getCandidatesInMyMissions(m); }
    });
  }

  getCandidatesInMyMissions(missions: string[]) {
    this.fs.getColFilter('candidates', 'mission_id', 'in', missions).where('status', '==', 'Contratado').get()
      .then(r => {
      this.doughnutChartData[0][4] = r.size;
      this.fs.getColFilter('candidates', 'mission_id', 'in', missions).where('status', '==', 'Descartado').get()
      .then(re => {
        this.doughnutChartData[0][5] = re.size;
        this.graphic = true;
      });
    });
  }

}
