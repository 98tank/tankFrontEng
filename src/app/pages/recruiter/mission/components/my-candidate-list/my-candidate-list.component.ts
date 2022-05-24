import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CandidateData } from 'src/app/models';
import { FirebaseService } from 'src/app/services';
import { PopoverComponent } from 'src/app/shared/popover/popover.component';

@Component({
  selector: 'app-my-candidate-list',
  templateUrl: './my-candidate-list.component.html',
  styleUrls: ['./my-candidate-list.component.scss'],
})
export class MyCandidateListComponent implements OnInit {
  @Input() missionId: string;
  @Input() uid: string;
  candidates: CandidateData[] = [];

  constructor(
    private fs: FirebaseService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.getMyCandidates();
  }

  getMyCandidates() {
    this.fs.getColFilter('candidates', 'mission_id', '==', this.missionId)
      .where('uid_recruiter', '==', this.uid)
      .orderBy('update_date', 'desc').get()
      .then(res => {
      if (res.size > 0) { res.forEach(d => this.candidates.push(d.data() as CandidateData)); }
    });
  }

  async presentPopover(txt: string, event: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event,
      mode: 'ios',
      componentProps: {txt}
    });
    return await popover.present();
  }

}
