import { Component, OnInit } from '@angular/core';
import { MissionData } from 'src/app/models';
import { FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-missions-canceled',
  templateUrl: './missions-canceled.page.html',
  styleUrls: ['./missions-canceled.page.scss'],
})
export class MissionsCanceledPage implements OnInit {
  missionCanceled: MissionData[];
  loading: boolean;
  view = 'list';

  constructor(
    private fs: FirebaseService) { }

  ngOnInit() {
    this.getMissionCanceled();
  }

  changeView(event) {
    this.view = event;
  }

  getMissionCanceled() {
    this.missionCanceled = [];
    this.fs.getCollectionWithOrder('missions').where('status', '==', 'Cancelada').get().then(res => {
      if (res.size > 0) {
        res.forEach(d => {
          const m: MissionData = d.data() as MissionData;
          this.missionCanceled.push(m);
        });
      } else{ this.loading = true; }
    }).catch(() => this.missionCanceled = []);
  }

}
