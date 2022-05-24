import { Component, OnInit } from '@angular/core';
import { FirebaseService, AuthService } from 'src/app/services';
import { Commissions, MissionData } from 'src/app/models';
import { ModalController } from '@ionic/angular';
import { EditMissionComponent } from 'src/app/shared/edit-mission/edit-mission.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mission-under-review',
  templateUrl: './mission-under-review.page.html',
  styleUrls: ['./mission-under-review.page.scss'],
})
export class MissionUnderReviewPage implements OnInit {
  missionUnderReview: MissionData[];
  loading: boolean;
  c$: Observable<Commissions>;

  constructor(
    private auth: AuthService,
    private fs: FirebaseService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getMissionUnderReview();
    this.c$ = this.fs.commission$;
  }

  getMissionUnderReview() {
    this.fs.getColFilter('missions', 'uid', '==', this.auth.userUid).where('status', '==', 'Pendiente').orderBy('create_date', 'desc').get().then(res => {
      this.missionUnderReview = [];
      if (res.size === 0) {
        this.loading = true;
      }
      res.forEach(d => {
        this.missionUnderReview.push(d.data() as MissionData);
      });
    });
  }

  async missionView(mission: MissionData) {
    const modal = await this.modalController.create({
      component: EditMissionComponent,
      componentProps: {mission}
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data.data) {
      this.getMissionUnderReview();
    }
  }


}
