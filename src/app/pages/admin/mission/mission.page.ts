import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { pluck, tap } from 'rxjs/operators';
import { MissionData } from 'src/app/models';
import { AuthService, FirebaseService } from 'src/app/services';
import { EditMissionComponent } from 'src/app/shared/edit-mission/edit-mission.component';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.page.html',
  styleUrls: ['./mission.page.scss'],
})
export class MissionPage implements OnInit, OnDestroy {
  adminType$: Observable<string>;
  mission$: Observable<MissionData>;
  susbcription: Subscription = new Subscription();
  susbcription2: Subscription = new Subscription();

  constructor(
    private auth: AuthService,
    private fs: FirebaseService,
    private route: ActivatedRoute,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getParam();
  }

  ngOnDestroy(): void {
    this.susbcription.unsubscribe();
    this.susbcription2.unsubscribe();
  }

  getParam() {
    this.susbcription = this.route.paramMap.subscribe((p: ParamMap) => this.getMision(p.get('id')));
  }

  getMision(id: string) {
    this.mission$ = this.fs.getDocObserver(`missions/${id}`).pipe(tap((m: MissionData) => {
      this.getAdminType();
    }));
  }

  changeStatus(m: MissionData, status: string) {
    this.fs.updateDoc(`missions/${m.mission_id}`, { status });
  }

  async editAllMission(mission: MissionData) {
    const modal = await this.modalController.create({
      component: EditMissionComponent,
      componentProps: {mission}
    });
    return await modal.present();
  }

  getAdminType() {
    this.susbcription2 = this.auth.getAuth().subscribe(u => {
      if (u?.uid) { this.adminType$ = this.fs.getDocObserver(`users/${u.uid}`).pipe(pluck('profile', 'type')); }
    });
  }

}
