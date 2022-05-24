import { Component, OnInit } from '@angular/core';
import { MissionData, User } from 'src/app/models';
import { FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-payment-history-pending',
  templateUrl: './payment-history-pending.page.html',
  styleUrls: ['./payment-history-pending.page.scss'],
})
export class PaymentHistoryPendingPage implements OnInit {
  buttonPrevious = false;
  lastDocument: any = null;
  firstDocument: any = null;
  missionsPending: any[] = [];

  constructor(
    private fs: FirebaseService,
  ) { }

  ngOnInit() {
    this.getMissionsPending();
  }

  trackByFn(index: number): number {
    return index;
  }

  getMissionsPending(action?: string) {
    let document;
    if (action === 'previous') {
      document = this.firstDocument;
      if (document) {
        this.fs.getColFilter('missions', 'status_payment', '==', 'Pendiente').orderBy('create_date', 'asc').endBefore(document)
          .limitToLast(40)
          .get().then((res) => {
            this.firstDocument = res.docs[0];
            this.lastDocument = res.docs[res.docs.length - 1];
            this.LoadDataUser(res);
          });
      } else {
        this.fs.getColFilter('missions', 'status_payment', '==', 'Pendiente').orderBy('create_date', 'asc')
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
        this.fs.getColFilter('missions', 'status_payment', '==', 'Pendiente').orderBy('create_date', 'asc').startAfter(document)
          .limit(40)
          .get().then((res) => {
            this.firstDocument = res.docs[0];
            this.lastDocument = res.docs[res.docs.length - 1];
            if (this.lastDocument) {
              this.LoadDataUser(res);
            } else {
              this.getMissionsPending('next');
            }
          });
      } else {
        this.fs.getColFilter('missions', 'status_payment', '==', 'Pendiente').orderBy('create_date', 'asc')
          .limit(40)
          .get().then((res) => {
            this.firstDocument = res.docs[0];
            this.lastDocument = res.docs[res.docs.length - 1];
            this.LoadDataUser(res);
          });
      }
    }
  }

  LoadDataUser(r: any) {
    let counter = 0;
    const temp: any[] = [];
    if (r.size > 0) {
      r.forEach(d => {
        const m: MissionData = d.data() as MissionData;
        this.fs.afs.doc(`users/${m.uid}`).get().subscribe(res => {
          const c: User = res.data() as User;
          ++counter;
          const newMission = {
            pay: m.pay,
            id: m.mission_id,
            position: m.name_position,
            create_date: m.create_date,
            name: c.profile.name_contact,
            name_company: c.profile.company_name,
          };
          temp.push(newMission);
          if (counter === r.size) {
            this.missionsPending = temp;
          }
        });
      });
    }
  }

  pagination(action: string) {
    this.getMissionsPending(action);
    if (action === 'next') {
      this.buttonPrevious = true;
    }
  }
}
