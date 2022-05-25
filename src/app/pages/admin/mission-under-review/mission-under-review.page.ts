import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Commissions, MissionData } from 'src/app/models';
import { FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-mission-under-review',
  templateUrl: './mission-under-review.page.html',
  styleUrls: ['./mission-under-review.page.scss'],
})
export class MissionUnderReviewPage {
  missionPending: MissionData[];
  loading: boolean;
  c$: Observable<Commissions>;

  constructor(
    private fs: FirebaseService
  ) { }

  ionViewWillEnter() {
    this.getPendingMisions();
    this.c$ = this.fs.commission$;
  }

  getPendingMisions() {
    this.missionPending = [];
    this.fs.getColFilter('missions', 'status', '==', 'Pending').get().then(res => {
      if (res.size > 0) {
        res.forEach(d => {
          const m: MissionData = d.data() as MissionData;
          this.missionPending.push(m);
        });
      } else{ this.loading = true; }
    }).catch(() => this.missionPending = []);
  }

}
