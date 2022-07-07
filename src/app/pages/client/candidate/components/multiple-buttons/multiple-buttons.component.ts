import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { CandidateData, Interview, MissionData } from 'src/app/models';
import { ExternalApiService, FirebaseService } from 'src/app/services';
import { CreateInterviewComponent } from '../create-interview/create-interview.component';

@Component({
  selector: 'app-multiple-buttons',
  templateUrl: './multiple-buttons.component.html',
  styleUrls: ['./multiple-buttons.component.scss'],
})
export class MultipleButtonsComponent implements OnInit {
  @Input() candidate: CandidateData;

  constructor(
    private fs: FirebaseService,
    private eas: ExternalApiService,
    private alertController: AlertController,
    private modalController: ModalController,
  ) { }

  ngOnInit() {}

  async createInterview() {
    const modal = await this.modalController.create({
      component: CreateInterviewComponent,
      backdropDismiss: false,
      componentProps: {candidateId: 'kr'}
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      const interview: Interview = {
        status: 'pending',
        channel: data.interview.channel,
        address: data.interview.address,
        options: [
          {
            date: data.interview.date_option1,
            selected: false
          },
          {
            date: data.interview.date_option2,
            selected: false
          },
        ]
      };
      await this.fs.updateDoc(`candidates/${this.candidate.candidate_id}`, { interview });
      this.sendNotificationsEmail();
    }
  }

  async sendNotificationsEmail() {
    const snapshopData = await this.fs.getDoc(`missions/${this.candidate.mission_id}`);
    const mission: MissionData = snapshopData.data();
    const subject = `98Tank - New proposed interview`;
    const messageRecruiter = `You have an interview proposal to accept in the mission ${mission.name_position}.`;
    const url = `${window.location.origin}/reclutador/misiones-elegidas/mision/candidato/${this.candidate.candidate_id}`;
    const resp = await this.eas.sendEmail(this.candidate.uid_recruiter, messageRecruiter, url, subject);
  }

  async openAlertDiscard() {
    const alert = await this.alertController.create({
      header: 'The candidate will be Discarded',
      message: 'Indicate the reason for discarding it.',
      mode: 'ios',
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Reason'
        },
      ],
      buttons: [
        { text: 'Exit', role: 'cancel' },
        { text: 'Discard', handler: (e) => { this.discardCandidate(e); }
      }]
    });
    await alert.present();
  }

  discardCandidate(e) {
    if (e.reason) {
      const reason = e.reason || '';
      this.fs.updateDoc(`candidates/${this.candidate.candidate_id}`, {status: 'Discarded', reason_discard: reason});
    }
  }

  async openAlertActive() {
    const alert = await this.alertController.create({
      header: 'Do you want to activate this candidate?',
      message: 'Press OK to activate',
      mode: 'ios',
      buttons: [
        { text: 'Extit', role: 'cancel' },
        { text: 'OK', handler: (e) => { this.activateCandidate(); }
      }]
    });
    await alert.present();
  }

  activateCandidate() {
    this.fs.updateDoc(`candidates/${this.candidate.candidate_id}`, { status: 'Active' });
  }

}
