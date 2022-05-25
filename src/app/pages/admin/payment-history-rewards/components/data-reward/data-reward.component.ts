import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { File } from 'src/app/models';
import { AuthService, FirebaseService, MediaService, SharedService } from 'src/app/services';
import { SeeAttachedComponent } from 'src/app/shared/see-attached/see-attached.component';

@Component({
  selector: 'app-data-reward',
  templateUrl: './data-reward.component.html',
  styleUrls: ['./data-reward.component.scss'],
})
export class DataRewardComponent implements OnInit {
  @Input() data: any;
  reload = false;

  constructor(
    public ms: MediaService,
    private auth: AuthService,
    private ss: SharedService,
    private fs: FirebaseService,
    private modal: ModalController,
    private modalController: ModalController) { }

  ngOnInit() {
    this.updateCounterStatistics();
  }

  closeModal() {
    this.modal.dismiss({reload: this.reload});
  }

  async updateCounterStatistics() {
    if (!this.data.seen_by_admin) {
      await this.fs.updateDoc(`reward/${this.data.id_reward}`, { seen_by_admin: true });
      const user = await this.fs.getDoc(`users/${this.auth.userUid}`);
      const newStatiscisReward: number = --user.data().statistics.pending_rewards;
      await this.fs.updateDoc(`users/${this.auth.userUid}`, { 'statistics.pending_rewards': newStatiscisReward });
      this.reload = true;
    }
  }


  getUrl(event: File) {
    const date: number = this.ss.getDate().getTime();
    this.data.pay = event;
    this.data.status = 'Paid';
    this.fs.updateDoc(`reward/${this.data.id_reward}`, { pay: this.data.pay, status: 'Paid', update_date: date });
  }

  deletePay() {
    if (this.data.pay?.filePath) {
      this.ms.deleteImgStorage(this.data.pay.filePath);
      this.data.pay = null;
      this.data.status = 'Pending';
      this.fs.updateDoc(`reward/${this.data.id_reward}`, { status: 'Pending' });
      this.fs.deleteField(`reward/${this.data.id_reward}`, 'Paid');
    }
  }

  async watch() {
    if (this.data.pay) {
      const modal = await this.modalController.create({
        component: SeeAttachedComponent,
        componentProps: {pay: this.data.pay}
      });
      return await modal.present();
    }
  }

}
