import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { AlertController, IonContent } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { DateInterface, Profile, User } from 'src/app/models';
import { AuthService, ExternalApiService, FirebaseService, MediaService, SharedService } from 'src/app/services';

@Component({
  selector: 'app-edit-my-account',
  templateUrl: './edit-my-account.page.html',
  styleUrls: ['./edit-my-account.page.scss'],
})
export class EditMyAccountPage implements OnInit, OnDestroy {
  creando: any;
  form: FormGroup;
  mailExists = false;
  user: User;
  date: DateInterface;
  dateValid = true;
  currentDate: Date;
  currentAge: number;
  imgAvatar: string = null;
  area$: Observable<string[]>;
  banks$: Observable<string[]>;
  studies$: Observable<string[]>;
  @ViewChild('topPage') content: IonContent;
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();

  constructor(
    private ms: MediaService,
    private auth: AuthService,
    private ss: SharedService,
    private fs: FirebaseService,
    private formBuild: FormBuilder,
    private eas: ExternalApiService,
    private alertController: AlertController,
    private adapter: DateAdapter<any>) {
      this.adapter.setLocale('es');
     }

  ngOnInit() {
    this.getUser();
    this.getAreas();
    this.getBanks();
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
          this.user = user;
          this.date = this.user.profile.birthdate;
          this.imgAvatar = this.user.profile.avatar;
          this.buildForm();
        });
      }
    });
  }

  private buildForm() {
    this.form = this.formBuild.group({
      nickname: [this.user.profile.nickname, [Validators.required, Validators.minLength(2)]],
      name: [this.user.profile.name, [Validators.required, Validators.minLength(2)]],
      email: [this.user.profile.email, [Validators.required, Validators.pattern(/^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)]],
      address: [this.user.profile.address, [Validators.required, Validators.minLength(2)]],
      personal_phone: [this.user.profile.personal_phone || '', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      curp: [this.user.profile.curp, [Validators.minLength(18), Validators.maxLength(18)]],
      rfc: [this.user.profile.rfc, [Validators.minLength(12), Validators.maxLength(13)]],
      level_of_study: [this.user.profile.level_of_study],
      career: [this.user.profile.career],
      area_of_interest: [this.user.profile.area_of_interest, Validators.required],
      name_bank: [this.user.profile.name_bank],
      clabe: [this.user.profile.clabe, [Validators.pattern(/^[0-9]+$/), Validators.minLength(18), Validators.maxLength(18)]],
      account_number: [this.user.profile.account_number || '', Validators.pattern(/^[0-9]+$/)],
    });
  }

  getAreas() {
    this.area$ = this.fs.getDocObserver('utilities/mission_fields').pipe(pluck('area'));
  }

  getStudies() {
    this.studies$ = this.fs.getDocObserver('utilities/mission_fields').pipe(pluck('studies'));
  }

  getBanks() {
    this.banks$ = this.ss.getDataJsonLocal('', 'assets/data/banks.json').pipe(pluck('banks'));
  }

  getDataUpdate() {
    if (this.date?.day && this.date?.month && this.date?.year) {
      this.dateValid = true;
      if (this.form.valid) {
        const profile: Profile = {
          ...this.user.profile,
          ...this.form.value,
          avatar: this.imgAvatar,
          birthdate: this.date,
          update_Date: this.ss.getDate().getTime(),
          clabe: parseFloat(this.form.value.clabe),
          personal_phone: parseFloat(this.form.value.personal_phone) || '',
          account_number: parseFloat(this.form.value.account_number) || ''
        };
        this.fs.updateDoc(`users/${this.user.profile.uid}`, { profile }).then(() => this.updateSuccess());
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

  async updateSuccess() {
    const alert = await this.alertController.create({
      cssClass: 'update-alert',
      header: 'Perfil Actualizado',
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
      header: '¿Has olvidado tu contraseña?',
      mode: 'ios',
      cssClass: 'reset-pass',
      message: `¡Le enviaremos las instrucciones a la siguiente dirección de correo electrónico! <br> <strong>${this.user.profile.email}</strong>`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Submitt',
          handler: () => { this.eas.sendEmailNotification(this.user.profile.email, 'reset'); }
        },
      ],
    });
    await alert.present();
  }


  async uploadImg(img, canvasId) {
    if (img.target.files[0]) {
      this.imgAvatar = await this.ms.onUpload(img, canvasId, 400);
    }
  }

  async rotateImg(canvasId) {
    this.imgAvatar = await this.ms.rotateAvatar(canvasId, 400);
  }

  buildDate(e) {
    this.date = {
      ...this.date,
      [e.type]: e.value
    };
    if (this.date?.day && this.date?.month && this.date?.year) { this.dateValid = true; }
  }


}
