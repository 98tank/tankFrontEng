import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { MissionData } from 'src/app/models';
import { AuthService, FirebaseService } from 'src/app/services';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-missions-completed',
  templateUrl: './missions-completed.page.html',
  styleUrls: ['./missions-completed.page.scss'],
})
export class MissionsCompletedPage implements OnInit, OnDestroy {
  loading: boolean;
  closedMission: MissionData[] = [];
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  subscription3: Subscription = new Subscription();

  constructor(
    private auth: AuthService,
    private fs: FirebaseService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscription1.add(this.subscription2);
    this.subscription1.unsubscribe();
  }
  ionViewWillEnter(){
    this.getUser();
  }

  getUser() {
    this.subscription1 = this.auth.getAuth().subscribe(u => {
      if (u?.uid) { this.getHiredCandidate(u.uid); }
    });
  }

  getHiredCandidate(uid: string) {
    this.fs.getColFilter('candidates', 'uid_recruiter', '==', uid).where('status', '==', 'Hired').orderBy('type_contract.date', 'desc').get().then(res => {
      if (res.size === 0) { this.loading = true; }
      if (res.size > 0) {
        res.forEach(async d => {
          const c = d.data() as MissionData;
          const queryMission = await this.fs.getDoc(`missions/${c.mission_id}`);
          this.closedMission.push(queryMission.data());
        });
      }
    });
  }

  async missionView(mission: MissionData, view: string) {
    const contracted = true;
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: { mission, view, contracted }
    });
    return await modal.present();
  }

}
