import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertController, IonContent } from '@ionic/angular';
import { DateInterface, User } from 'src/app/models';
import { AuthService, ExternalApiService, FirebaseService, MediaService, SharedService } from 'src/app/services';
import { Observable, Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-edit-my-account',
  templateUrl: './edit-my-account.page.html',
  styleUrls: ['./edit-my-account.page.scss'],
})
export class EditMyAccountPage implements OnInit, OnDestroy {
  user: User;
  creando: any;
  form: UntypedFormGroup;
  mailExists = false;
  currentAge: number;
  dateValid = true;
  date: DateInterface;
  currentDate: Date;
  imgAvatar: string = null;
  studies$: Observable<string[]>;
  @ViewChild('topPage') content: IonContent;
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();

  constructor(
    private ms: MediaService,
    private auth: AuthService,
    private ss: SharedService,
    private fs: FirebaseService,
    private formBuild: UntypedFormBuilder,
    private eas: ExternalApiService,
    private alertController: AlertController) { }

  ngOnInit() {
    this.getUser();
    this.getStudies();
    this.currentDate = this.ss.getDate();
  }

  ngOnDestroy(): void {
    this.subscription1.add(this.subscription2);
    this.subscription1.unsubscribe();
  }

  getUser() {
    this.subscription1 = this.auth.getAuth().subscribe(u => {
      if (u?.uid) {
        this.subscription2 = this.fs.getDocObserver(`users/${u.uid}`).subscribe((user: User) => {
          this.imgAvatar = user.profile.avatar;
          this.date = user.profile.birthdate;
          this.user = user;
          this.buildForm();
        });
      }
    });
  }

  private buildForm() {
    this.form = this.formBuild.group({
      nickname: [this.user.profile.nickname, [Validators.minLength(2)]],
      name: [this.user.profile.name, [ Validators.minLength(2)]],
      email: [this.user.profile.email, [Validators.required, Validators.pattern(/^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)]],
      address: [this.user.profile.address, [Validators.required, Validators.minLength(2)]],
      personal_phone: [this.user.profile.personal_phone || '', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      curp: [this.user.profile.curp, [Validators.minLength(18), Validators.maxLength(18)]],
      rfc: [this.user.profile.rfc, [Validators.minLength(12), Validators.maxLength(13)]],
      level_of_study: [this.user.profile.level_of_study],
      career: [this.user.profile.career],
    });
  }

  async uploadImg(img, canvasId) {
    if (img.target.files[0]) {
      this.imgAvatar = await this.ms.onUpload(img, canvasId, 400);
    }
  }

  async rotateImg(canvasId) {
    this.imgAvatar = await this.ms.rotateAvatar(canvasId, 400);
  }

  getDataRegister() {
    if (this.date?.day && this.date?.month && this.date?.year) {
      this.dateValid = true;
      if (this.form.valid) {
        this.sendRegister(this.form.value);
      } else {
        this.form.markAllAsTouched();
        this.content.scrollToTop(400);
      }
    } else {
      this.dateValid = false;
      this.form.markAllAsTouched();
      this.content.scrollToTop(400);
    }
  }

  sendRegister(data) {
    const user: User = {
      profile: {
        ...this.user.profile,
        ...data,
        avatar: this.imgAvatar,
        birthdate: this.date,
        personal_phone: parseFloat(data.personal_phone) || '',
        update_Date: this.ss.getDate().getTime()
      }
    };
    this.fs.updateDoc(`users/${this.user.profile.uid}`, user).then(() => this.updateSuccess());
  }

  getStudies() {
    this.studies$ = this.fs.getDocObserver('utilities/mission_fields').pipe(pluck('studies'));
  }

  async updateSuccess() {
    const alert = await this.alertController.create({
      cssClass: 'update-alert',
      header: 'Updated profile',
      mode: 'ios',
      message: '<ion-icon class="green" name="checkmark-circle"></ion-icon>',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ]
    });
    await alert.present();
  }

  async resetPassword() {
    const alert = await this.alertController.create({
      header: 'Forgot password?',
      mode: 'ios',
      cssClass: 'reset-pass',
      message: `Please check the following Email address as the instructions  to change your password will be sent there. <br> <strong>${this.user.profile.email}</strong>`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Submit',
          handler: () => { this.eas.sendEmailNotification(this.user.profile.email, 'reset'); }
        },
      ],
    });
    await alert.present();
  }

  buildDate(e) {
    this.date = {
      ...this.date,
      [e.type]: e.value
    };
    if (this.date?.day && this.date?.month && this.date?.year) { this.dateValid = true; }
  }


}
