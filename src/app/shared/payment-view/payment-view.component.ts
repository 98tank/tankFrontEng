import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { File } from 'src/app/models';
import { SeeAttachedComponent } from 'src/app/shared/see-attached/see-attached.component';

@Component({
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.scss'],
})
export class PaymentViewComponent {
  @Input() pay: File;
  @Input() message: string;

  constructor(
    private modalController: ModalController) { }

  async openPeyment() {
    const modal = await this.modalController.create({
      component: SeeAttachedComponent,
      componentProps: {pay: this.pay}
    });
    return await modal.present();
  }

}
