import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { File } from 'src/app/models';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-see-attached',
  templateUrl: './see-attached.component.html',
  styleUrls: ['./see-attached.component.scss'],
})
export class SeeAttachedComponent implements OnInit {
  @Input() pay: File;
  data;

  constructor(
    private modal: ModalController,
    private sanatizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.sanatizerURL();
   }

  closeModal() {
    this.modal.dismiss();
  }

  sanatizerURL() {
    if (this.pay.type === 'application/pdf') {
      const url = this.sanatizer.bypassSecurityTrustResourceUrl(this.pay.url);
      this.data = {
        type: this.pay.type,
        name: this.pay.name,
        url
      };
    } else {
      this.data = this.pay;
    }
  }

}
