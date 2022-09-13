import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
  form: UntypedFormGroup;
  contract: string;
  candidate: CandidateData;

  constructor(
    private router: Router,
    private ss: SharedService,
    private fs: FirebaseService,
    private eas: ExternalApiService,
    private formBuilder: UntypedFormBuilder,
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
      phone: ['',  Validators.required]
    });
  }

  getData() {
    if (this.form.valid) {
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
    this.fs.updateDoc(`missions/${this.candidate.mission_id}`, { status: 'Accomplished', type_contract: tc,  update_date: date });
    this.fs.updateDoc(`candidates/${this.candidate.candidate_id}`, { status: 'Hired', type_contract: tc,  update_date: date });
    this.changeStatusAllRelatedCandidates(this.candidate, date);
    this.createReward(date);
    this.sendNotificationsEmail(type);
  }

  async changeStatusAllRelatedCandidates(candidate: CandidateData, date: number) {
    let counter = 0;
    const idCand: string[] = [];
    const dataCandidate = await this.fs.getColFilter('candidates', 'mission_id', '==', candidate.mission_id).where('candidate_id', '!=', candidate.candidate_id).where('status', '==', 'Active').get();
    if (dataCandidate.size > 0) {
      dataCandidate.forEach(d => {
        ++counter;
        const c: CandidateData = d.data() as CandidateData;
        idCand.push(c.candidate_id);
        if (dataCandidate.size === counter) {
          idCand.forEach((cid: string) => this.fs.updateDoc(`candidates/${cid}`, {status: 'Discarded', update_date: date}));
        }
      });
    }
  }

  async updateSuccess() {
    const alert = await this.alertController.create({
      cssClass: 'update-alert',
      backdropDismiss: false,
      header: 'Mission accomplished successfully',
      subHeader: 'Missions Accomplished',
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
      status: 'Pending',
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
      const subjecRecruitert  = `98Tank - New Direct hire`;
      const messageRecruitert = `Your Candidate ${this.candidate.name} has been selected for immediate hiring, time to collect.`;
      const urlRecruiter      = `${window.location.origin}/reclutador/historial-de-pago`;
      const rec               = await this.eas.sendEmail(this.candidate.uid_recruiter, messageRecruitert, urlRecruiter, subjecRecruitert);

      const subjecClient      = `98Tank - New Direct hire`;
      const messageClient     = `You have hired ${this.candidate.name}, Contact information below.`;
      const urlClient         = `${window.location.origin}/cliente/misiones-culminadas`;
      const cli               = await this.eas.sendEmail(this.candidate.uid_client, messageClient, urlClient, subjecClient);

      const subjectAdmin      = `98Tank - New Direct hire`;
      const messageAdmin      = `The candidate ${this.candidate.name} has been hired, you can proceed with the pending payment.`;
      const urlAdmin          = `${window.location.origin}/admin/payment-history/rewards`;
      const adm               = await this.eas.sendEmailAdmins(messageAdmin, urlAdmin, subjectAdmin);
    }
    if (type === 'service') {
      const subjecRecruitert  = `98Tank - New Hire as a Service`;
      const messageRecruitert = `Your Candidate ${this.candidate.name} has been selected for immediate hiring, time to collect.`;
      const urlRecruiter      = `${window.location.origin}/reclutador/historial-de-pago`;
      const rec               = await this.eas.sendEmail(this.candidate.uid_recruiter, messageRecruitert, urlRecruiter, subjecRecruitert);

      const subjecClient      = `98Tank - New Hire as a Service`;
      const messageClient     = `You hired ${this.candidate.name}, an 98Tank agent Will contact you soon.`;
      const urlClient         = `${window.location.origin}/cliente/misiones-culminadas`;
      const cli               = await this.eas.sendEmail(this.candidate.uid_client, messageClient, urlClient, subjecClient);

      const subjectAdmin      = `98Tank - New Hire as a Service`;
      const messageAdmin      = `You have hired ${this.candidate.name} Contact information below. NAME: ${this.form.value.name} , PHONE: ${this.form.value.phone}`;
      const urlAdmin          = `${window.location.origin}/admin/mision/${this.candidate.mission_id}`;
      const adm               = await this.eas.sendEmailAdmins(messageAdmin, urlAdmin, subjectAdmin);
    }
  }

}
