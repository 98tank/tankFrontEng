import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.scss'],
})
export class PdfViewComponent implements OnInit {
  @Input() file: string;
  url: string;

  constructor(
    private modal: ModalController) { }

  ngOnInit() {
    this.getUrl();
  }

  closeModal() {
    this.modal.dismiss();
  }

  getUrl() {
    this.url = location.origin;
  }

}
