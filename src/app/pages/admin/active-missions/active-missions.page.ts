import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { MissionData } from 'src/app/models';
import { FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-active-missions',
  templateUrl: './active-missions.page.html',
  styleUrls: ['./active-missions.page.scss'],
})
export class ActiveMissionsPage {
  activeMission: MissionData[];
  route = '/admin/mision';
  area$: Observable<string[]>;
  active = 'all';

  constructor(
    private fs: FirebaseService
  ) { }

  ionViewWillEnter() {
    this.getPendingMisions();
    this.getAreas();
  }

  getPendingMisions() {
    this.activeMission = [];
    this.fs.getColFilter('missions', 'status', '==', 'Activa').orderBy('create_date', 'desc').get().then(res => {
      if (res.size > 0) {
        res.forEach(d => {
          const m: MissionData = d.data() as MissionData;
          this.activeMission.push(m);
        });
      }
    }).catch(() => this.activeMission = []);
  }

  getAreas() {
    this.area$ = this.fs.getDocObserver('utilities/mission_fields').pipe(pluck('area'));
  }

  filterArea(a) {
    this.active = a.detail.value;
  }

}
