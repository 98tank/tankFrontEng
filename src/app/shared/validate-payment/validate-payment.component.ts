import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Commissions, File } from 'src/app/models';
import { FirebaseService, MediaService } from 'src/app/services';
import { SeeAttachedComponent } from '../see-attached/see-attached.component';

@Component({
  selector: 'app-validate-payment',
  templateUrl: './validate-payment.component.html',
  styleUrls: ['./validate-payment.component.scss'],
})
export class ValidatePaymentComponent implements OnInit {
  @Input() pay: File;
  @Input() tankPrice: number;
  c$: Observable<Commissions>;
  @Output() url = new EventEmitter<object>();
  @Output() delete = new EventEmitter<boolean>();

  constructor(
    public ms: MediaService,
    private fs: FirebaseService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.c$ = this.fs.commission$;
  }

  getUrl(event: File) {
    this.url.emit(event);
  }

  async watch() {
    const modal = await this.modalController.create({
      component: SeeAttachedComponent,
      componentProps: {pay: this.pay}
    });
    return await modal.present();
  }

  deletePay() {
    this.delete.emit(true);
  }

}
