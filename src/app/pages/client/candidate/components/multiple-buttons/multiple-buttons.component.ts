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
    const subject = `98Tank - Nueva entrevista propuesta`;
    const messageRecruiter = `Tienes una propuesta de entrevista por aceptar en la misión ${mission.name_position}.`;
    const url = `${window.location.origin}/reclutador/misiones-elegidas/mision/candidato/${this.candidate.candidate_id}`;
    const resp = await this.eas.sendEmail(this.candidate.uid_recruiter, messageRecruiter, url, subject);
    console.log(resp);
  }

  async openAlertDiscard() {
    const alert = await this.alertController.create({
      header: 'El candidato será descartado',
      message: 'Indique la razón para descartarlo.',
      mode: 'ios',
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Razon'
        },
      ],
      buttons: [
        { text: 'Salir', role: 'cancel' },
        { text: 'Descartar', handler: (e) => { this.discardCandidate(e); }
      }]
    });
    await alert.present();
  }

  discardCandidate(e) {
    if (e.reason) {
      const reason = e.reason || '';
      this.fs.updateDoc(`candidates/${this.candidate.candidate_id}`, {status: 'Descartado', reason_discard: reason});
    }
  }

  async openAlertActive() {
    const alert = await this.alertController.create({
      header: '¿Desea activar este candidato?',
      message: 'Presione OK para activar',
      mode: 'ios',
      buttons: [
        { text: 'Salir', role: 'cancel' },
        { text: 'OK', handler: (e) => { this.activateCandidate(); }
      }]
    });
    await alert.present();
  }

  activateCandidate() {
    this.fs.updateDoc(`candidates/${this.candidate.candidate_id}`, { status: 'Activo' });
  }

}
