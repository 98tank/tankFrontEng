import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MissionData, Refound, RequestRefound } from 'src/app/models';
import { AuthService, ExternalApiService, FirebaseService } from 'src/app/services';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { RequestRefundComponent } from 'src/app/shared/request-refund/request-refund.component';

@Component({
  selector: 'app-missions-canceled',
  templateUrl: './missions-canceled.page.html',
  styleUrls: ['./missions-canceled.page.scss'],
})
export class MissionsCanceledPage implements OnInit {
  cancelledMissions: MissionData[];
  loading: boolean;

  constructor(
    private auth: AuthService,
    private fs: FirebaseService,
    private eas: ExternalApiService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.getMissionCanceled();
  }

  getMissionCanceled() {
    this.fs.getColFilter('missions', 'uid', '==', this.auth.userUid).where('status', '==', 'Cancelled').orderBy('update_date', 'desc').get().then(res => {
      this.cancelledMissions = [];
      if (res.size === 0) { this.loading = true; }
      res.forEach(d =>  this.cancelledMissions.push(d.data() as MissionData) );
    });
  }

  async missionView(mission: MissionData, view: string) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      backdropDismiss: false,
      componentProps: { mission, view }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.createRefound(data.data);
    }
  }

  async openRefound(mission: MissionData) {
    const modal = await this.modalController.create({
      component: RequestRefundComponent,
      backdropDismiss: false,
      componentProps: { mission }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.createRefound(data.data);
    }
  }

  async createRefound(data: RequestRefound) {
    const requestRefound: RequestRefound = data;
    const request: Refound = {
      status: 'Pending',
      reason: data.reason,
      update_date: requestRefound.update_date
    };
    await this.fs.updateDoc(`missions/${requestRefound.mission_id}`, { request_refound: request });
    await this.fs.setDoc(`request_refound/${requestRefound.request_id}`, requestRefound);
    this.getMissionCanceled();
    this.sendNotificationsEmail(requestRefound);
  }

  async sendNotificationsEmail(request: RequestRefound) {
      const subjectAdmin = `98Tank - Solicitud de reembolso`;
      const messageAdmin = `El Cliente ${request.uid_client} Solicito un reembolso de la mision ${request.name_position}.`;
      const urlAdmin     = `${window.location.origin}/admin/payment-history/returns`;
      this.eas.sendEmailAdmins(messageAdmin, urlAdmin, subjectAdmin);
  }

}
