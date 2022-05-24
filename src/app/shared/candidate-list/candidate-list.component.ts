import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CandidateData } from 'src/app/models';
import { FirebaseService } from 'src/app/services';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
})
export class CandidateListComponent implements OnInit {
  @Input() route: string;
  @Input() missionId: string;
  candidates: CandidateData[] = [];

  constructor(
    private fs: FirebaseService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.getCandidates();
  }

  getCandidates() {
    this.fs.getColFilter('candidates', 'mission_id', '==', this.missionId)
    .orderBy('update_date', 'desc').get().then(res => {
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
