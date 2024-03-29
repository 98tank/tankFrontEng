import { pluck } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonContent, ModalController } from '@ionic/angular';
import { Subscription, Observable } from 'rxjs';
import { CandidateData, MissionData, Country, DateInterface, File } from 'src/app/models';
import { AuthService, ExternalApiService, FirebaseService, MediaService, SharedService } from 'src/app/services';
import { SeeAttachedComponent } from 'src/app/shared/see-attached/see-attached.component';

@Component({
  selector: 'app-create-candidate',
  templateUrl: './create-candidate.page.html',
  styleUrls: ['./create-candidate.page.scss'],
})
export class CreateCandidatePage implements OnInit, OnDestroy {
  dataCurrentCurp: any;
  cf: any;
  cv: File;
  success = false;
  dateValid = true;
  currentDate: Date;
  currentAge: number;
  mission: MissionData;
  form: UntypedFormGroup;
  states$: Observable<any>;
  countries$: Observable<Country[]>;
  @ViewChild('topPage') content: IonContent;
  subscription: Subscription = new Subscription();

  constructor(
    public ms: MediaService,
    public ss: SharedService,
    public auth: AuthService,
    private fs: FirebaseService,
    private route: ActivatedRoute,
    private eas: ExternalApiService,
    private formBuild: UntypedFormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.getParam();
    this.getCandidateFields();
    this.currentDate = this.ss.getDate();
    this.getCountries();
    this.getStates();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getCountries() {
    this.countries$ = this.ss.getDataJsonLocal('', 'assets/data/countries.json').pipe(pluck('countries'));
  }

  getStates() {
    this.states$ = this.ss.getDataJsonLocal('', 'assets/data/states.json');
  }

  getCandidateFields() {
    this.fs.getDocObserver('utilities/candidates_fields').subscribe((res: any) => {
      this.cf = res;
      this.buildForm();
    });
  }

  getParam() {
    this.subscription = this.route.params.subscribe( async p => {
      const snapShot = await this.fs.getDoc(`missions/${p.id}`);
      this.mission = snapShot.data();
    });
  }

  private buildForm() {
    this.form = this.formBuild.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      years_of_experience: ['', Validators.required],
      studies: ['', Validators.required],
      stateOfResidence: ['', Validators.required],
      availability: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)]],
      address: ['', [Validators.required, Validators.minLength(2)]],
      guards: [''],
      languages: [''],
      work_permit: ['', Validators.required],
      nationality: ['', Validators.required],
      travel: ['', Validators.required],
      skills: ['', Validators.minLength(2)],
      courses_and_certi: ['', Validators.minLength(2)],
      specialized_software: ['', Validators.minLength(2)],
      comments: ['', Validators.minLength(2)],
      ssn: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      company_1: [''],
      period_1: [''],
      position_1: [''],
      achievements_1: [''],
      company_2: [''],
      period_2: [''],
      position_2: [''],
      achievements_2: [''],
      company_3: [''],
      period_3: [''],
      position_3: [''],
      achievements_3: [''],
      curriculumVideo: [''],
      seen_by_the_client: [false],
    });
  }

  async getDataForm() {
      this.dateValid = true;
      if (this.form.valid) {
        this.dataCurrentCurp = await this.createCURP(this.form.value);
        if (this.dataCurrentCurp?.curpExists) {
          this.thisUserExist();
        } else {
          this.presentAlertConfirm();
        }
      } else {
        this.content.scrollToTop(400);
        this.form.markAllAsTouched();
      }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      header: 'Create this candidate?',
      mode: 'ios',
      message: '<ion-icon class="yellow" name="person-add"></ion-icon> Press OK to create the candidate for this mission',
      buttons: [
        {
          text: 'Review',
          role: 'cancel',
        }, {
          text: 'Ok',
          handler: () => this.createCandidate()
        }
      ]
    });
    await alert.present();
  }

  createCandidate() {
    const id: string = this.fs.afs.createId();
    const date: number = this.ss.getDate().getTime();
    let candidate: CandidateData = {
      ...this.form.value,
      guards: 'No',
      block: false,
      status: 'Active',
      candidate_id: id,
      create_date: date,
      update_date: date,
      uid_client: this.mission.uid,
      uid_recruiter: this.auth.userUid,
      mission_id: this.mission.mission_id,
      email: this.form.value.email.toLowerCase(),
      curp: this.dataCurrentCurp.curp,
    };
    if (this.cv) {
      candidate = {
        ...candidate,
        cv: this.cv
      };
    }
    this.fs.setDoc(`candidates/${id}`, candidate)
      .then(() => {
        this.success = true;
        this.dataCurrentCurp = null;
        this.cv = null;
        this.form.reset();
        this.sendNotificationsEmail();
      });
  }

  async sendNotificationsEmail() {
    const subject = `98Tank - New candidate`;
    const messageClient = `You have a new candidate posted in your mission ${this.mission.name_position}`;
    const url = `${window.location.origin}/cliente/misiones-activas/mision/${this.mission.mission_id}`;
    const resp = await this.eas.sendEmail(this.mission.uid, messageClient, url, subject);
  }

  newCandidate() {
    this.form.reset();
    this.success = false;
  }

  getUrl(event: File) {
    this.cv = { ...event };
  }

  deletePay() {
    if (this.cv.filePath) {
      this.ms.deleteImgStorage(this.cv.filePath);
      this.cv = null;
    }
  }

  async watch() {
    if (this.cv) {
      const modal = await this.modalController.create({
        component: SeeAttachedComponent,
        componentProps: {pay: this.cv}
      });
      return await modal.present();
    }
  }

  validatorCURP(): AsyncValidatorFn{
    return async (control: AbstractControl): Promise<ValidationErrors | null> => {
      const queryCURP = await this.fs.getColFilter('candidates', 'curp', '==', control.value).where('mission_id', '==', this.mission.mission_id).get();
      if (queryCURP.size > 0) {
        return { curpExists: true };
      } else {
        return null;
      }
    };
  }

  // Para construir pediremos First Name + Last Name + State of Residence + last 4 digits SSN CATECA0000 - Carlos Tea California 0000 -
  async createCURP(c: CandidateData) {
    const curp = `${c.name.slice(0, 2)}${c.lastName.slice(0, 2)}${c.stateOfResidence}${c.ssn}`.toUpperCase();
    const queryCURP = await this.fs.getColFilter('candidates', 'curp', '==', curp).where('mission_id', '==', this.mission.mission_id).get();
    if (queryCURP.size > 0) {
      return { curpExists: true };
    } else {
      return {curp};
    }
  }

  async thisUserExist() {
    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      header: 'Alert',
      mode: 'ios',
      subHeader: 'Important message',
      message: '<ion-icon class="red" name="close-circle-outline"></ion-icon> This candidate already exists in this mission.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
