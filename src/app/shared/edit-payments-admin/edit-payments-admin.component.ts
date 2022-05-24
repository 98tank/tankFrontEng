import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { MissionData } from 'src/app/models';
import { FirebaseService, SharedService } from 'src/app/services';

@Component({
  selector: 'app-edit-payments-admin',
  templateUrl: './edit-payments-admin.component.html',
  styleUrls: ['./edit-payments-admin.component.scss'],
})
export class EditPaymentsAdminComponent implements OnInit {
  @Input() mission: MissionData;
  paid: string;
  check: boolean;

  constructor(
    private ss: SharedService,
    public fs: FirebaseService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.statusPayment();
  }

  statusPayment(){
    this.paid = this.mission.status_payment;
    if (this.paid === 'Paid') {
      this.check = true;
    } else {
      this.check = false;
    }
  }

  async editReward(r: string | number  | any) {
    if (r.length > 0 && this.mission) {
      const date: number = this.ss.getDate().getTime();
      await this.fs.updateDoc(`missions/${this.mission.mission_id}`, { reward: parseFloat(r),  update_date: date});
      this.presentAlert();
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: '¡Exito!',
      mode: 'ios',
      message: 'La recompensa para esta posición ha sido actualizada, y sera visible para todo los reclutadores.',
      buttons: ['OK']
    });
    await alert.present();
  }

  changePayment(e) {
    const date: number = this.ss.getDate().getTime();
    e.detail.checked ? this.paid = 'Paid' : this.paid = 'Pending';
    this.fs.updateDoc(`missions/${this.mission.mission_id}`, { status_payment: this.paid, update_date: date });
  }

}
