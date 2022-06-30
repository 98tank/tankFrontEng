import { pluck } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { MissionData, MissionFields, File, User, States } from 'src/app/models';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthService, FirebaseService, MediaService, SharedService } from 'src/app/services';
import { PickerController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-mission',
  templateUrl: './edit-mission.component.html',
  styleUrls: ['./edit-mission.component.scss'],
})
export class EditMissionComponent implements OnInit {
  @Input() mission: MissionData;
  form: UntypedFormGroup;
  mf: MissionFields;
  success = false;
  isSuperAdmin: boolean;
  states$: Observable<States[]>;
  hiringTime = ['1 to 3 weeks', '4 to 6 weeks', 'more than 6 weeks'];

  constructor(
    public ms: MediaService,
    private ss: SharedService,
    private auth: AuthService,
    private fs: FirebaseService,
    private modal: ModalController,
    private formBuild: UntypedFormBuilder) {
   }

  ngOnInit() {
    this.buildForm();
    this.getMissionFields();
    this.getStates();
    this.getTypeUser();
  }

  async getTypeUser() {
    const user = await this.fs.getDoc(`users/${this.auth.userUid}`);
    (user.data() as User).profile.type === 'superAdmin' ? this.isSuperAdmin = true : this.isSuperAdmin = false;
  }

  closeModal(reload: boolean) {
    this.modal.dismiss({data: reload});
  }

  getStates() {
    this.states$ = this.ss.getDataJsonLocal('', 'assets/data/states.json').pipe(pluck('states'));
  }

  getMissionFields() {
    this.fs.getDocObserver('utilities/mission_fields').subscribe((res: MissionFields) => {
      this.mf = res;
    });
  }


  private buildForm() {
    this.form = this.formBuild.group({
      name_position: [this.mission.name_position, [Validators.required, Validators.minLength(2)]],
      position_level: [this.mission.position_level, Validators.required],
      years_of_experience: [this.mission.years_of_experience, Validators.required],
      area: [this.mission.area, Validators.required],
      ingles: [this.mission.ingles, Validators.required],
      duration: [this.mission.duration, Validators.required],
      duration_details: [this.mission.duration_details],
      sex: [this.mission.sex, Validators.required],
      studies: [this.mission.studies, Validators.required],
      net_salary: [this.mission.net_salary],
      benefits: [this.mission.benefits, Validators.required],
      benefits_details: [this.mission.benefits_details],
      work_zone: [this.mission.work_zone, [Validators.required, Validators.minLength(2)]],
      state: [this.mission.state, Validators.required],
      hiringTime: [this.mission.hiringTime, Validators.required],
      schedule: [this.mission.schedule],
      numberInterviews: [this.mission.numberInterviews, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      travel: [this.mission.travel, Validators.required],
      indispensables_skills: [this.mission.indispensables_skills, Validators.minLength(2)],
      desireble_skills: [this.mission.desireble_skills, Validators.minLength(2)],
      courses_and_certi: [this.mission.courses_and_certi, Validators.minLength(2)],
      specialized_software: [this.mission.specialized_software, Validators.minLength(2) ],
      comments: [this.mission.comments, Validators.minLength(2)],
    });
  }

  getDataMision() {
    if (this.form.valid) {
      const date = this.ss.getDate().getTime();
      const newMission: MissionData = {
        ...this.mission,
        ...this.form.value,
        update_date: date,
      };
      this.fs.updateDoc(`missions/${this.mission.mission_id}`, newMission)
        .then(() => this.success = true)
        .catch(() => this.success = false);
    } else {
      this.form.markAllAsTouched();
    }
  }

  getUrl(event: File) {
    this.mission.pay = { ...event };
    this.fs.updateDoc(`missions/${this.mission.mission_id}`, { pay: this.mission.pay });
  }

  delete(event: boolean) {
    if (event) {
      this.ms.deleteImgStorage(this.mission.pay.filePath);
      this.mission.pay = {};
      this.fs.updateDoc(`missions/${this.mission.mission_id}`, { pay: this.mission.pay });
    }
  }

}
