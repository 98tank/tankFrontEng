import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MissionData } from 'src/app/models';
import { AuthService, FirebaseService } from 'src/app/services';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-missions-completed',
  templateUrl: './missions-completed.page.html',
  styleUrls: ['./missions-completed.page.scss'],
})
export class MissionsCompletedPage implements OnInit {
  closedMission: MissionData[];
  loading: boolean;

  constructor(
    private auth: AuthService,
    private fs: FirebaseService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getMissionCompleted();
  }

  getMissionCompleted() {
    this.fs.getColFilter('missions', 'uid', '==', this.auth.userUid).where('status', '==', 'Accomplished').orderBy('type_contract.date', 'desc').get().then(res => {
      this.closedMission = [];
      if (res.size === 0) { this.loading = true; }
      res.forEach(d =>  this.closedMission.push(d.data() as MissionData) );
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
