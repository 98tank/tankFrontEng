import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Commissions, Refound } from 'src/app/models';
import { FirebaseService, SharedService } from 'src/app/services';
import { DataReturnComponent } from './components/data-return/data-return.component';

@Component({
  selector: 'app-payment-history-returns',
  templateUrl: './payment-history-returns.page.html',
  styleUrls: ['./payment-history-returns.page.scss'],
})
export class PaymentHistoryReturnsPage implements OnInit {
  buttonPrevious = false;
  lastDocument: any = null;
  firstDocument: any = null;
  returns: any[] = [];
  c$: Observable<Commissions>;

  constructor(
    private ss: SharedService,
    private fs: FirebaseService,
    private modalController: ModalController) { }

  ngOnInit() {
    this.c$ = this.fs.commission$;
    this.getReturns();
  }

  trackByFn(index: number): number {
    return index;
  }

  getReturns(action?: string) {
    let document;
    const date: number = this.ss.getDate().getTime();
    if (action === 'previous') {
      document = this.firstDocument;
      if (document) {
        this.fs.getColFilter('request_refound', 'create_date', '<=', date).orderBy('create_date', 'desc').endBefore(document)
          .limitToLast(30)
          .get().then((res) => {
            this.firstDocument = res.docs[0];
            this.lastDocument = res.docs[res.docs.length - 1];
            this.loadReturns(res);
          });
      } else {
        this.fs.getColFilter('request_refound', 'create_date', '<=', date).orderBy('create_date', 'desc')
          .limit(30)
          .get().then((res) => {
            this.firstDocument = res.docs[0];
            this.lastDocument = res.docs[res.docs.length - 1];
            this.loadReturns(res);
          });
      }
    } else {
      document = this.lastDocument;
      if (document) {
        this.fs.getColFilter('request_refound', 'create_date', '<=', date).orderBy('create_date', 'desc').startAfter(document)
          .limit(30)
          .get().then((res) => {
            this.firstDocument = res.docs[0];
            this.lastDocument = res.docs[res.docs.length - 1];
            if (this.lastDocument) {
              this.loadReturns(res);
            } else {
              this.getReturns('next');
            }
          });
      } else {
        this.fs.getColFilter('request_refound', 'create_date', '<=', date).orderBy('create_date', 'desc')
          .limit(30)
          .get().then((res) => {
            this.firstDocument = res.docs[0];
            this.lastDocument = res.docs[res.docs.length - 1];
            this.loadReturns(res);
          });
      }
    }
  }


  loadReturns(data: any) {
    let counter = 0;
    const temp: any[] = [];
    if (data.size > 0) {
      data.forEach(d => {
        ++counter;
        const r: Refound = d.data() as Refound;
        temp.push(r);
        if (counter === data.size) { this.returns = temp; }
      });
    }
  }

  pagination(action: string) {
    this.getReturns(action);
    if (action === 'next') {
      this.buttonPrevious = true;
    }
  }

  async more(d) {
    const modal = await this.modalController.create({
      component: DataReturnComponent,
      componentProps: { data: d },
      backdropDismiss: false
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data.reload) { this.getReturns(); }
  }

}
