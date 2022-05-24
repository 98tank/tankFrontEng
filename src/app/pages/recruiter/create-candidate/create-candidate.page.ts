import { pluck } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
  cf: any;
  cv: File;
  form: FormGroup;
  success = false;
  dateValid = true;
  currentDate: Date;
  currentAge: number;
  date: DateInterface;
  mission: MissionData;
  countries$: Observable<Country[]>;
  @ViewChild('topPage') content: IonContent;
  subscription: Subscription = new Subscription();

  constructor(
    public ms: MediaService,
    public ss: SharedService,
    public auth: AuthService,
    private fs: FirebaseService,
    private route: ActivatedRoute,
    private formBuild: FormBuilder,
    private eas: ExternalApiService,
    private alertController: AlertController,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.getParam();
    this.getCandidateFields();
    this.currentDate = this.ss.getDate();
    this.getCountries();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getCountries() {
    this.countries$ = this.ss.getDataJsonLocal('', 'assets/data/countries.json').pipe(pluck('countries'));
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
      years_of_experience: ['', Validators.required],
      place_of_birth: ['', [Validators.required, Validators.minLength(2)]],
      sex: ['', Validators.required],
      civil_status: ['', Validators.required],
      studies: ['', Validators.required],
      availability: ['', Validators.required],
      sons: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      email: ['', [Validators.required, Validators.pattern(/^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)]],
      address: ['', [Validators.required, Validators.minLength(2)]],
      guards: [''],
      ingles: ['No'],
      work_permit: ['', Validators.required],
      nationality: ['', Validators.required],
      travel: ['', Validators.required],
      skills: ['', Validators.minLength(2)],
      courses_and_certi: ['', Validators.minLength(2)],
      specialized_software: ['', Validators.minLength(2)],
      comments: ['', Validators.minLength(2)],
      curp: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18), Validators.pattern(/^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/)], [this.validatorCURP()]],
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

  getDataForm() {
    if (this.date?.day && this.date?.month && this.date?.year) {
      this.dateValid = true;
      if (this.form.valid) {
        this.presentAlertConfirm();
      } else {
        this.content.scrollToTop(400);
        this.form.markAllAsTouched();
      }
    } else {
      this.dateValid = false;
      this.form.markAllAsTouched();
      this.content.scrollToTop(400);
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      header: '¿Crear este candidato?',
      mode: 'ios',
      message: '<ion-icon class="yellow" name="person-add"></ion-icon> Al presionar "Ok" se creara el candidato con los datos proporcionados, y este sera asignado a esta mision',
      buttons: [
        {
          text: 'Revisar',
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
      birthdate: this.date,
      uid_client: this.mission.uid,
      uid_recruiter: this.auth.userUid,
      mission_id: this.mission.mission_id,
      email: this.form.value.email.toLowerCase(),
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
        this.date = null;
        this.form.reset();
        this.sendNotificationsEmail();
      });
  }

  async sendNotificationsEmail() {
    const subject = `98Tank - Nuevo candidato`;
    const messageClient = `Tienes un nuevo candidato posteado en tu mision ${this.mission.name_position}`;
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

  buildDate(e) {
    this.date = {
      ...this.date,
      [e.type]: e.value
    };
    if (this.date?.day && this.date?.month && this.date?.year) { this.dateValid = true; }
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

}
