import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CandidateData, MissionData } from 'src/app/models';
import { FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() mission: MissionData;
  @Input() view: string;
  @Input() contracted: boolean;
  candidate: CandidateData;

  constructor(
    private fs: FirebaseService,
    private modal: ModalController) { }

  ngOnInit() {
    this.getHiredCandidate();
   }

  closeModal() {
    this.modal.dismiss();
  }

  getHiredCandidate() {
    this.fs.getColFilter('candidates', 'mission_id', '==', this.mission.mission_id).where('status', '==', 'Contratado').get().then(r => {
      if (r.size > 0) {
        r.forEach(d => this.candidate = d.data() as CandidateData);
      }
    });
  }

}
