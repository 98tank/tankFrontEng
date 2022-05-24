import { Component, OnInit } from '@angular/core';
import { MissionData } from 'src/app/models';
import { FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-missions-completed',
  templateUrl: './missions-completed.page.html',
  styleUrls: ['./missions-completed.page.scss'],
})
export class MissionsCompletedPage implements OnInit {
  missionCompleted: MissionData[];
  loading: boolean;
  view = 'list';

  constructor(
    private fs: FirebaseService) { }

  ngOnInit() {
    this.getMissionCompleted();
  }

  changeView(event) {
    this.view = event;
  }

  getMissionCompleted() {
    let counter = 0;
    const missionCompletedTemp = [];
    this.fs.getColFilter('missions', 'status', '==', 'Completada').get().then(res => {
      if (res.size > 0) {
        res.forEach(d => {
          ++counter;
          const m: MissionData = d.data() as MissionData;
          missionCompletedTemp.push(m);
          if (counter === res.size) {
            this.missionCompleted = missionCompletedTemp;
          }
        });
      } else{ this.loading = true; }
    }).catch(() => this.missionCompleted = []);
  }

}
