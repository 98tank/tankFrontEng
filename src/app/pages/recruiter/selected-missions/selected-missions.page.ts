import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MissionData } from 'src/app/models';
import { AuthService, FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-selected-missions',
  templateUrl: './selected-missions.page.html',
  styleUrls: ['./selected-missions.page.scss'],
})
export class SelectedMissionsPage implements OnInit, OnDestroy {
  selectedMissions: MissionData[];
  route = '/reclutador/misiones-elegidas/mision';
  loading = true;
  noMission = false;
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  subscription3: Subscription = new Subscription();
  active: string;
  status = ['Activa', 'Completada'];

  constructor(
    private auth: AuthService,
    private fs: FirebaseService) { }

  ngOnInit() {
    this.active = 'all';
    this.getUser();
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
  }

  getUser() {
    this.subscription1 = this.auth.getAuth().subscribe(u => {
      if (u?.uid) {
        this.getSelectedMissions(u.uid);
      }
    });
  }

  getSelectedMissions(uid: string) {
    this.fs.getCollectionWithOrder(`users/${uid}/missions_selected`).orderBy('create_date', 'desc').get().then(res => {
      this.selectedMissions = [];
      if (res.size === 0) {
        this.loading = false;
        this.noMission = true;
      }
      if (res.size > 0) {
        this.noMission = false;
        res.forEach(d => {
          this.loading = false;
          const data = d.data();
          this.subscription2 = this.fs.getDocObserver(`missions/${data.mission_id}`).pipe(take(1)).subscribe((m: MissionData) => {
            if (m && (m.status === 'Active' || m.status === 'Accomplished')) {
              this.selectedMissions.push(m);
              this.selectedMissions.sort((a, b) => {
                if (a.status > b.status) { return 1; }
                if (a.status < b.status) { return -1; }
                return 0;
              });
            } else {
              this.fs.deleteDoc(`users/${uid}/missions_selected/${data.mission_id}`);
            }
          });
        });
      }
    });
  }

  filterArea(a) {
    this.active = a.detail.value;
  }

}
