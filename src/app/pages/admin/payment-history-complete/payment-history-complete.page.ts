import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models';
import { FirebaseService } from 'src/app/services';
import { MissionData, File } from '../../../models/mission-data';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { SeeAttachedComponent } from 'src/app/shared/see-attached/see-attached.component';

@Component({
  selector: 'app-payment-history-complete',
  templateUrl: './payment-history-complete.page.html',
  styleUrls: ['./payment-history-complete.page.scss'],
})
export class PaymentHistoryCompletePage implements OnInit {
  missionsComplet: any[] = [];
  items = 20;
  lastDocument: any = null;
  firstDocument: any = null;
  buttonPrevious = false;

  constructor(
    private fs: FirebaseService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getMissionsComplet();
  }

  trackByFn(index: number): number {
    return index;
  }

  LoadDataUser(r: any) {
    if (r.size > 0) {
      let counter = 0;
      const temp: any[] = [];
      r.forEach( async d => {
        const m: MissionData = d.data() as MissionData;
        const res = await this.fs.getDoc(`users/${m.uid}`);
        const c: User = res.data() as User;
        ++counter;
        const newMission = {
          position: m.name_position,
          name_company: c.profile.company_name,
          name: c.profile.name_contact,
          pay: m.pay,
          id: m.mission_id,
          status: m.status
        };
        temp.push(newMission);
        if (counter === r.size) { this.missionsComplet = temp; }
      });
    }
  }

  getMissionsComplet(action?: string) {
    let document;
    if (action === 'previous') {
      document = this.firstDocument;
      if (document) {
        this.fs.getColFilter('missions', 'status_payment', '==', 'Paid').orderBy('create_date', 'asc').endBefore(document)
          .limitToLast(40)
          .get().then((res) => {
            this.firstDocument = res.docs[0];
            this.lastDocument = res.docs[res.docs.length - 1];
            this.LoadDataUser(res);
          });
      } else {
        this.fs.getColFilter('missions', 'status_payment', '==', 'Paid').orderBy('create_date', 'asc')
          .limit(40)
          .get().then((res) => {
            this.firstDocument = res.docs[0];
            this.lastDocument = res.docs[res.docs.length - 1];
            this.LoadDataUser(res);
          });
      }
    } else {
      document = this.lastDocument;
      if (document) {
        this.fs.getColFilter('missions', 'status_payment', '==', 'Paid').orderBy('create_date', 'asc').startAfter(document)
          .limit(40)
          .get().then((res) => {
            this.firstDocument = res.docs[0];
            this.lastDocument = res.docs[res.docs.length - 1];
            if (this.lastDocument) {
              this.LoadDataUser(res);
            } else {
              this.getMissionsComplet('next');
            }
          });
      } else {
        this.fs.getColFilter('missions', 'status_payment', '==', 'Paid').orderBy('create_date', 'asc')
          .limit(40)
          .get().then((res) => {
            this.firstDocument = res.docs[0];
            this.lastDocument = res.docs[res.docs.length - 1];
            this.LoadDataUser(res);
          });
      }
    }
  }

  pagination(action: string) {
    this.getMissionsComplet(action);
    if (action === 'next') {
      this.buttonPrevious = true;
    }
  }

  async watch(pay: File) {
    const modal = await this.modalController.create({
      component: SeeAttachedComponent,
      componentProps: {pay}
    });
    return await modal.present();
  }

}
