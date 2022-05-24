import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { MissionData, User } from 'src/app/models';
import { FirebaseService } from 'src/app/services';

interface UsersCard {
  admins: number;
  clients: number;
  recruiters: number;
}
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
  public doughnutChartData: MultiDataSet = [[0, 0, 0, 0, 0, 0, 0]];
  public doughnutChartLabels: Label[] = ['Created Missions', 'Missions under Review', 'Active Missions', 'Missions Accomplished', 'Cancelled Missions', ' Accepted Candidates', 'Rejected Missions'];
  public pieChartColors = [{backgroundColor: ['#061347', '#a8a8a8', '#ec5e04', '#8dbdd8', '#000000', '#03a45e', '#e42300'], }, ];
  users: UsersCard = {
    admins: 0,
    clients: 0,
    recruiters: 0,
  };
  loading = true;

  constructor(
    private fs: FirebaseService
  ) { }

  ngOnInit() {
    this.getStatistics();
    this.getUser();
  }

  update() {
    this.getStatistics();
    this.getUser();
  }

  getUser() {
    this.loading = true;
    this.users.clients = 0;
    this.users.recruiters = 0;
    this.users.admins = 0;
    this.fs.afs.collection('users').get().subscribe(r => {
      if (r.size > 0) {
        let counter = 0;
        r.forEach(d => {
          const u: User = d.data() as User;
          if (u.profile?.type === 'client') { ++this.users.clients; }
          if (u.profile?.type === 'recruiter') { ++this.users.recruiters; }
          if (u.profile?.type === 'admin' || u.profile?.type === 'superAdmin') { ++this.users.admins; }
          ++counter;
          if (r.size === counter) { this.loading = false; }
        });
      }
     });
  }

  getStatistics() {
    let active = 0;
    let review = 0;
    let completed = 0;
    let cancel = 0;
    this.fs.afs.collection('missions').get().subscribe( r => {
      this.doughnutChartData[0][0] = r.size;
      if (r.size > 0) {
        let counter = 0;
        r.forEach(d => {
          const m: MissionData = d.data() as MissionData;
          if (m.status === 'Pending') { this.doughnutChartData[0][1] = ++review; }
          if (m.status === 'Active') { this.doughnutChartData[0][2] = ++active; }
          if (m.status === 'Accomplished') { this.doughnutChartData[0][3] = ++completed; }
          if (m.status === 'Cancelled') { this.doughnutChartData[0][4] = ++cancel; }
          ++counter;
          if (r.size === counter) { this.getCandidatesInMissions(); }
        });
      } else { this.getCandidatesInMissions(); }
    });
  }

  getCandidatesInMissions() {
    this.fs.getColFilter('candidates', 'status', '==', 'Contratado').get()
      .then(r => {
      this.doughnutChartData[0][5] = r.size;
      this.fs.getColFilter('candidates', 'status', '==', 'Descartado').get()
      .then(re => {
        this.doughnutChartData[0][6] = re.size;
        this.graphic = true;
      });
    });
  }

}
