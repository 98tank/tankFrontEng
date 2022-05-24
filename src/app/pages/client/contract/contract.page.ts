import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CandidateData, Reward, TypeContract } from 'src/app/models';
import { ExternalApiService, FirebaseService, SharedService } from 'src/app/services';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.page.html',
  styleUrls: ['./contract.page.scss'],
})
export class ContractPage implements OnInit {
  form: FormGroup;
  contract: string;
  candidate: CandidateData;

  constructor(
    private router: Router,
    private ss: SharedService,
    private fs: FirebaseService,
    private eas: ExternalApiService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.getState();
    this.builForm();
  }

  getState() {
    if (window.history.state.data) {
      this.candidate = window.history.state.data.user;
    } else {
      window.history.back();
    }
  }

  setContract(e) {
    this.contract = e.detail.value;
    if (this.contract === 'direct') { this.saveContract('direct'); }
  }

  private builForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['',  [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]]
    });
  }

  getData() {
    if (this.form.valid) {
      console.log('Establacer contacto con el cliente, estos son los datos', this.form.value);
      this.updateSuccess();
      this.saveContract('service', this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  saveContract(type: string, data?) {
    const date: number = this.ss.getDate().getTime();
    const tc: TypeContract = {
      client: { ...data } || '',
      type,
      date,
      contacted: 'No'
    };
    this.fs.updateDoc(`missions/${this.candidate.mission_id}`, { status: 'Completada', type_contract: tc,  update_date: date });
    this.fs.updateDoc(`candidates/${this.candidate.candidate_id}`, { status: 'Contratado', type_contract: tc,  update_date: date });
    this.changeStatusAllRelatedCandidates(this.candidate, date);
    this.createReward(date);
    this.sendNotificationsEmail(type);
  }

  async changeStatusAllRelatedCandidates(candidate: CandidateData, date: number) {
    let counter = 0;
    const idCand: string[] = [];
    const dataCandidate = await this.fs.getColFilter('candidates', 'mission_id', '==', candidate.mission_id).where('candidate_id', '!=', candidate.candidate_id).where('status', '==', 'Activo').get();
    if (dataCandidate.size > 0) {
      dataCandidate.forEach(d => {
        ++counter;
        const c: CandidateData = d.data() as CandidateData;
        idCand.push(c.candidate_id);
        if (dataCandidate.size === counter) {
          idCand.forEach((cid: string) => this.fs.updateDoc(`candidates/${cid}`, {status: 'Descartado', update_date: date}));
        }
      });
    }
  }

  async updateSuccess() {
    const alert = await this.alertController.create({
      cssClass: 'update-alert',
      backdropDismiss: false,
      header: 'La misión ha sido completada con éxito',
      subHeader: 'Te llevaremos al área de misiones completadas',
      mode: 'ios',
      message: '<ion-icon class="green" name="checkmark-circle"></ion-icon>',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.router.navigate(['/cliente/misiones-culminadas']);
          }
        }
      ]
    });
    await alert.present();
  }

  createReward(date: number) {
    const idReward: string = this.fs.afs.createId();
    const reward: Reward = {
      create_date: date,
      update_date: date,
      seen_by_admin: false,
      seen_by_recruiter: false,
      status: 'Pendiente',
      id_reward: idReward,
      name: this.candidate.name,
      mission_id: this.candidate.mission_id,
      uid_client: this.candidate.uid_client,
      uid_recruiter: this.candidate.uid_recruiter,
    };
    this.fs.setDoc(`reward/${idReward}`, reward);
  }

  async sendNotificationsEmail(type: string) {
    if (type === 'direct') {
      const subjecRecruitert  = `98Tank - Nueva contratación Directa`;
      const messageRecruitert = `Tu candidato ${this.candidate.name} ha sido contratado, ya puedes cobrar la recompensa para la posición.`;
      const urlRecruiter      = `${window.location.origin}/reclutador/historial-de-pago`;
      const rec               = await this.eas.sendEmail(this.candidate.uid_recruiter, messageRecruitert, urlRecruiter, subjecRecruitert);

      const subjecClient      = `98Tank - Nueva contratación Directa`;
      const messageClient     = `Contrataste a ${this.candidate.name}, ya puedes tener acceso a la data completa del candidato incluyendo su telefono y correo.`;
      const urlClient         = `${window.location.origin}/cliente/misiones-culminadas`;
      const cli               = await this.eas.sendEmail(this.candidate.uid_client, messageClient, urlClient, subjecClient);

      const subjectAdmin      = `98Tank - Nueva contratación por Directa`;
      const messageAdmin      = `El Candidatos ${this.candidate.name} fue contratado en forma directa. Ya se puede proceder a pagar la recompensa al reclutador`;
      const urlAdmin          = `${window.location.origin}/admin/payment-history/rewards`;
      const adm               = await this.eas.sendEmailAdmins(messageAdmin, urlAdmin, subjectAdmin);
    }
    if (type === 'service') {
      const subjecRecruitert  = `98Tank - Nueva contratación por Servicios`;
      const messageRecruitert = `Tu candidato ${this.candidate.name} ha sido contratado, ya puedes cobrar la recompensa para la posición.`;
      const urlRecruiter      = `${window.location.origin}/reclutador/historial-de-pago`;
      const rec               = await this.eas.sendEmail(this.candidate.uid_recruiter, messageRecruitert, urlRecruiter, subjecRecruitert);

      const subjecClient      = `98Tank - Nueva contratación por Servicios`;
      const messageClient     = `Contrataste a ${this.candidate.name}, en breve un representante de 98Tank le contactara para brindarle mas información sobre el servicio.`;
      const urlClient         = `${window.location.origin}/cliente/misiones-culminadas`;
      const cli               = await this.eas.sendEmail(this.candidate.uid_client, messageClient, urlClient, subjecClient);

      const subjectAdmin      = `98Tank - Nueva contratación por Servicio`;
      const messageAdmin      = `El Candidatos ${this.candidate.name} fue contratado en forma de servicios. Los datos proporcionados por el cliente para contactarlo son los siguientes, NOMBRE: ${this.form.value.name} , TELEFONO: ${this.form.value.phone}`;
      const urlAdmin          = `${window.location.origin}/admin/mision/${this.candidate.mission_id}`;
      const adm               = await this.eas.sendEmailAdmins(messageAdmin, urlAdmin, subjectAdmin);
    }
  }

}
