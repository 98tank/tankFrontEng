import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Commissions, MissionData, File, RequestRefound } from 'src/app/models';
import { AuthService, FirebaseService } from 'src/app/services';
import { SeeAttachedComponent } from 'src/app/shared/see-attached/see-attached.component';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.page.html',
  styleUrls: ['./payment-history.page.scss'],
})
export class PaymentHistoryPage implements OnInit {
  loading: boolean;
  payments: MissionData[];
  refounds: RequestRefound[];
  c$: Observable<Commissions>;

  constructor(
    private auth: AuthService,
    private fs: FirebaseService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.getUser();
    this.c$ = this.fs.commission$;
  }

  getUser() {
    this.auth.getAuth().subscribe(u => {
      if (u?.uid) {
        this.getTransaction(u.uid);
        this.getRefound(u.uid);
      }
    });
  }

  getTransaction(uid: string) {
    this.fs.getColFilter('missions', 'uid', '==', uid).orderBy('create_date', 'desc').get().then(res => {
      this.payments = [];
      if (res.size === 0) { this.loading = true; }
      res.forEach(d => {
        this.payments.push(d.data() as MissionData);
      });
    });
  }

  getRefound(uid: string) {
    this.fs.getColFilter('request_refound', 'uid', '==', uid).orderBy('create_date', 'desc').get().then(res => {
      this.refounds = [];
      res.forEach(d => {
        this.refounds.push(d.data() as RequestRefound);
      });
    });
  }

  async watch(pay: File) {
    const modal = await this.modalController.create({
      component: SeeAttachedComponent,
      componentProps: {pay}
    });
    return await modal.present();
  }

}
