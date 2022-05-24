import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CandidateData } from 'src/app/models';
import { SeeAttachedComponent } from '../see-attached/see-attached.component';

@Component({
  selector: 'app-candidate-data',
  templateUrl: './candidate-data.component.html',
  styleUrls: ['./candidate-data.component.scss'],
})
export class CandidateDataComponent implements OnInit {
  @Input() title: string;
  @Input() contracted: boolean;
  @Input() candidate: CandidateData;

  constructor(
    private modalController: ModalController) {}

  ngOnInit() { }

  async watch() {
    if (this.candidate.cv) {
      const modal = await this.modalController.create({
        component: SeeAttachedComponent,
        componentProps: {pay: this.candidate.cv}
      });
      return await modal.present();
    }
  }

}
