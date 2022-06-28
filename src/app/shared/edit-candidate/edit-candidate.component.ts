import { pluck } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CandidateData, Country, DateInterface, File } from 'src/app/models';
import { FirebaseService, MediaService, SharedService } from 'src/app/services';
import { SeeAttachedComponent } from '../see-attached/see-attached.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-candidate',
  templateUrl: './edit-candidate.component.html',
  styleUrls: ['./edit-candidate.component.scss'],
})
export class EditCandidateComponent implements OnInit {
  form: UntypedFormGroup;
  @Input() candidate: CandidateData;
  cf: any;
  currentDate: Date;
  currentAge: number;
  success = false;
  date: DateInterface;
  dateValid = true;
  countries$: Observable<Country[]>;

  constructor(
    public ms: MediaService,
    private ss: SharedService,
    private fs: FirebaseService,
    private modal: ModalController,
    private formBuild: UntypedFormBuilder,
    private modalController: ModalController) { }

  ngOnInit() {
    this.getCandidateFields();
    this.currentDate = this.ss.getDate();
    this.getCountries();
    this.date = this.candidate.birthdate;
   }

  closeModal() {
    this.modal.dismiss();
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

  private buildForm() {
    this.form = this.formBuild.group({
      name: [this.candidate.name, [Validators.required, Validators.minLength(2)]],
      years_of_experience: [this.candidate.years_of_experience, Validators.required],
      place_of_birth: [this.candidate.place_of_birth, [Validators.required, Validators.minLength(2)]],
      sex: [this.candidate.sex, Validators.required],
      studies: [this.candidate.studies, Validators.required],
      availability: [this.candidate.availability, Validators.required],
      ingles: [this.candidate.ingles, Validators.required],
      phone: [this.candidate.phone, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      email: [this.candidate.email, [Validators.required, Validators.pattern(/^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)]],
      address: [this.candidate.address, [Validators.required, Validators.minLength(2)]],
      guards: [this.candidate.guards],
      work_permit: [this.candidate.work_permit, Validators.required],
      nationality: [this.candidate.nationality, Validators.required],
      travel: [this.candidate.travel, Validators.required],
      skills: [this.candidate.skills, Validators.minLength(2)],
      courses_and_certi: [this.candidate.courses_and_certi, Validators.minLength(2)],
      specialized_software: [this.candidate.specialized_software, Validators.minLength(2) ],
      comments: [this.candidate.comments, Validators.minLength(2)],
      company_1: [this.candidate.company_1],
      period_1: [this.candidate.period_1],
      position_1: [this.candidate.position_1],
      achievements_1: [this.candidate.achievements_1],
      company_2: [this.candidate.company_2],
      period_2: [this.candidate.period_2],
      position_2: [this.candidate.position_2],
      achievements_2: [this.candidate.achievements_2],
      company_3: [this.candidate.company_3],
      period_3: [this.candidate.period_3],
      position_3: [this.candidate.position_3],
      achievements_3: [this.candidate.achievements_3],
      curriculumVideo: [this.candidate.curriculumVideo],
    });
  }

  getDataUpdate() {
    if (this.date?.day && this.date?.month && this.date?.year) {
      this.dateValid = true;
      if (this.form.valid) {
        const date = this.ss.getDate().getTime();
        const newDataCandidate: CandidateData = {
          ...this.candidate,
          ...this.form.value,
          update_date: date,
          birthdate: this.date
        };
        this.fs.updateDoc(`candidates/${this.candidate.candidate_id}`, newDataCandidate)
          .then(() => this.success = true)
          .catch(() => this.success = false);
      } else {
        this.form.markAllAsTouched();
      }
    } else {
      this.dateValid = false;
      this.form.markAllAsTouched();
    }
  }

  getUrl(event: File) {
    this.candidate.cv = { ...event };
    this.fs.updateDoc(`candidates/${this.candidate.candidate_id}`, {cv: this.candidate.cv});
  }

  deletePay() {
    if (this.candidate.cv.filePath) {
      this.ms.deleteImgStorage(this.candidate.cv.filePath);
      delete this.candidate.cv;
      this.fs.deleteField(`candidates/${this.candidate.candidate_id}`, 'cv');
    }
  }

  async watch() {
    if (this.candidate.cv) {
      const modal = await this.modalController.create({
        component: SeeAttachedComponent,
        componentProps: {pay: this.candidate.cv}
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

}
