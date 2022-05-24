import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MissionData } from 'src/app/models';
import { AuthService, FirebaseService, SharedService } from 'src/app/services';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.page.html',
  styleUrls: ['./mission.page.scss'],
})
export class MissionPage implements OnInit, OnDestroy {
  mission$: Observable<MissionData>;
  exist: boolean;
  missionId: string;
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  subscription3: Subscription = new Subscription();

  constructor(
    public auth: AuthService,
    private ss: SharedService,
    private fs: FirebaseService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getParam();
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
  }

  getParam() {
    this.subscription1 = this.route.params.subscribe(p => {
      this.missionId = p.id;
      this.getMission(p.id);
      this.searchSelectMission(p.id);
    });
  }

  getMission(id: string) {
    this.mission$ = this.fs.getDocObserver(`missions/${id}`);
  }

  searchSelectMission(id: string) {
    this.subscription2 = this.auth.getAuth().subscribe(u => {
      if (u?.uid) {
        this.subscription3 = this.fs.getDocObserver(`users/${u.uid}/missions_selected/${id}`).subscribe(res => {
          if (res) { this.exist = true; }
          else { this.exist = false; }
        });
      }
    });
  }

  addSelectMission(m: MissionData) {
    const mission = {
      mission_id: m.mission_id,
      create_date: this.ss.getDate().getTime()
    };
    this.fs.setDoc(`users/${this.auth.userUid}/missions_selected/${m.mission_id}`, mission);
  }

}
