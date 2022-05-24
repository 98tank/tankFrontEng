import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Commissions, File, RequestRefound } from 'src/app/models';
import { AuthService, FirebaseService, MediaService, SharedService } from 'src/app/services';
import { SeeAttachedComponent } from 'src/app/shared/see-attached/see-attached.component';


@Component({
  selector: 'app-data-return',
  templateUrl: './data-return.component.html',
  styleUrls: ['./data-return.component.scss'],
})
export class DataReturnComponent implements OnInit {
  @Input() data: RequestRefound;
  c$: Observable<Commissions>;
  reload = false;

  constructor(
    public ms: MediaService,
    private ss: SharedService,
    private auth: AuthService,
    private fs: FirebaseService,
    private modal: ModalController,
    private modalController: ModalController) { }

  ngOnInit() {
    this.c$ = this.fs.commission$;
    this.updateCounterStatistics();
  }

  closeModal() {
    this.modal.dismiss({reload: this.reload});
  }

  async updateCounterStatistics() {
    if (!this.data.seen_by_admin) {
      await this.fs.updateDoc(`request_refound/${this.data.request_id}`, { seen_by_admin: true });
      const user = await this.fs.getDoc(`users/${this.auth.userUid}`);
      const newStatiscisRefound: number = --user.data().statistics.pending_refound;
      await this.fs.updateDoc(`users/${this.auth.userUid}`, { 'statistics.pending_refound': newStatiscisRefound });
      this.reload = true;
    }
  }


  getUrl(event: File) {
    const date: number = this.ss.getDate().getTime();
    this.data.pay_refound = event;
    this.data.status = 'Paid';
    this.fs.updateDoc(`request_refound/${this.data.request_id}`, { pay_refound: this.data.pay_refound, status: 'Paid', update_date: date });
  }

  deletePay() {
    if (this.data.pay_refound?.filePath) {
      this.ms.deleteImgStorage(this.data.pay_refound.filePath);
      this.data.pay_refound = null;
      this.data.status = 'Pending';
      this.fs.updateDoc(`request_refound/${this.data.request_id}`, { status: 'Pending' });
      this.fs.deleteField(`request_refound/${this.data.request_id}`, 'pay_refound');
    }
  }

  async watch() {
    if (this.data.pay_refound) {
      const modal = await this.modalController.create({
        component: SeeAttachedComponent,
        componentProps: {pay: this.data.pay_refound}
      });
      return await modal.present();
    }
  }
}
