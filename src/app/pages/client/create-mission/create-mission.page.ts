import { pluck } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FirebaseService, SharedService, AuthService, MediaService, ExternalApiService } from 'src/app/services';
import { IonContent } from '@ionic/angular';
import { MissionFields, MissionData, File } from 'src/app/models';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-mission',
  templateUrl: './create-mission.page.html',
  styleUrls: ['./create-mission.page.scss'],
})
export class CreateMissionPage implements OnInit {
  pay: File;
  success = false;
  form: UntypedFormGroup;
  mf: MissionFields;
  tankPrice: number;
  states$: Observable<string[]>;
  @ViewChild('topPage') content: IonContent;
  hiringTime = ['1 to 3 weeks', '4 to 6 weeks', 'more than 6 weeks'];

  constructor(
    public ms: MediaService,
    private ss: SharedService,
    private auth: AuthService,
    private fs: FirebaseService,
    private formBuild: UntypedFormBuilder,
    private eas: ExternalApiService,
    private alertController: AlertController) { }

  ngOnInit() {
    this.getMissionFields();
    this.getStates();
  }

  getStates() {
    this.states$ = this.ss.getDataJsonLocal('', 'assets/data/states.json').pipe(pluck('states'));
  }

  getMissionFields() {
    this.fs.getDocObserver('utilities/mission_fields').subscribe((res: MissionFields) => {
      this.mf = res;
      this.buildForm();
    });
  }

  calculatePrice(event) {
    // El 30% del Salario sera el costo de la mision
    // funcion desactivada
    this.tankPrice = event.detail.value;
  }

  private buildForm() {
    this.form = this.formBuild.group({
      name_position: ['', [Validators.required, Validators.minLength(2)]],
      years_of_experience: ['', Validators.required],
      position_level: ['', Validators.required],
      area: ['', Validators.required],
      duration: ['', Validators.required],
      duration_details: [''],
      ingles: ['No requerido'],
      sex: ['', Validators.required],
      studies: ['', Validators.required],
      salary_scheme: ['', Validators.required],
      net_salary: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      benefits: ['', Validators.required],
      benefits_details: [''],
      work_zone: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', Validators.required],
      schedule: [''],
      hiringTime: ['', Validators.required],
      numberInterviews: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      travel: ['', Validators.required],
      indispensables_skills: ['', Validators.minLength(2)],
      desireble_skills: ['', Validators.minLength(2)],
      courses_and_certi: ['', Validators.minLength(2)],
      specialized_software: ['', Validators.minLength(2) ],
      comments: ['', Validators.minLength(2)],
    });
  }

  getDataMision() {
    if (this.form.valid) {
      this.presentAlertConfirm();
    } else {
      this.content.scrollToTop(400);
      this.form.markAllAsTouched();
    }
  }

  createMision() {
    const date = this.ss.getDate().getTime();
    const id: string = this.fs.afs.createId();
    const newMission: MissionData = {
      ...this.form.value,
      create_date: date,
      update_date: date,
      numberInterviews: parseFloat(this.form.value.numberInterviews) || 0,
      uid: this.auth.userUid,
      mission_id: id,
      status_payment: 'Pending',
      pay: {},
      net_salary: parseFloat(this.form.value.net_salary),
      status: 'Pending'
    };
    this.fs.setDoc(`missions/${id}`, newMission).then(() => {
      this.form.reset();
      this.success = true;
      this.sendNotificationsEmail(newMission.name_position, newMission.mission_id);
    }).catch(() => this.success = false);
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      header: 'Do you want to create this mission?',
      mode: 'ios',
      message: '<ion-icon class="yellow" name="rocket-outline"></ion-icon> Pressing "Ok" will create the mission and go to review to be accepted',
      buttons: [
        {
          text: 'Review',
          role: 'cancel',
        }, {
          text: 'Ok',
          handler: () => {
            this.createMision();
          }
        }
      ]
    });
    await alert.present();
  }

  getUrl(event: File) {
    this.pay = { ...event };
  }

  delete(event: boolean) {
    if (event) {
      this.ms.deleteImgStorage(this.pay.filePath);
      this.pay = null;
    }
  }

  newMission() {
    this.form.reset();
    this.success = false;
    this.pay = null;
    this.tankPrice = null;
  }

  async sendNotificationsEmail(namePosition: string, missionID: string) {
    const subject = `98Tank - Misión creada`;
    const messageClient = `Tu misión "${namePosition}", ha sido creada con exito, y pasó a un estado de revisión por parte de los Administradores de 98Tank, en breve nos pondremos en contacto con contigo.`;
    const messageAdmins = `Fue creada la misión "${namePosition}", con el mission_id='${missionID}' `;
    const url = `${window.location.origin}/client/misiones-en-revision`;
    const urlAdmin = `${window.location.origin}/admin/mision/${missionID}`;
    const resp = await Promise.all([
      this.eas.sendEmail(this.auth.userUid, messageClient, url, subject),
      this.eas.sendEmailAdmins(messageAdmins, urlAdmin, subject),
    ]);
  }


}
