import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { MissionData } from 'src/app/models';
import { AuthService, FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-active-missions',
  templateUrl: './active-missions.page.html',
  styleUrls: ['./active-missions.page.scss'],
})
export class ActiveMissionsPage implements OnInit, OnDestroy {
  activeMissions: MissionData[];
  route = '/reclutador/misiones-activas/mision';
  loading = true;
  noMission = false;
  area$: Observable<string[]>;
  active = 'all';
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();

  constructor(
    private auth: AuthService,
    private fs: FirebaseService
  ) { }

  ngOnInit() {
    this.getActiveMissions();
    this.getAreas();
    // this.getMyAreaOfInterst();
  }

  ngOnDestroy(): void {
    this.subscription1.add(this.subscription2);
    this.subscription1.unsubscribe();
  }

  getActiveMissions() {
    this.fs.getColFilter('missions', 'status', '==', 'Active').orderBy('create_date', 'desc').get().then(res => {
      this.activeMissions = [];
      if (res.size === 0) {
        this.loading = false;
        this.noMission = true;
      }
      if (res.size > 0) {
        this.noMission = false;
        res.forEach(d => {
          this.loading = false;
          const data: MissionData = d.data() as MissionData;
          this.activeMissions.push(data);
        });
      }
    });
  }

  getAreas() {
    this.area$ = this.fs.getDocObserver('utilities/mission_fields').pipe(pluck('area'));
  }

  getMyAreaOfInterst() {
    this.subscription1 = this.auth.getAuth().subscribe(u => {
      if (u?.uid) {
        this.subscription2 = this.fs.getDocObserver(`users/${u.uid}`).pipe(pluck('profile', 'area_of_interest')).subscribe(aoi => this.active = aoi);
      }
    });
  }

  filterArea(a) {
    this.active = a.detail.value;
  }

}
