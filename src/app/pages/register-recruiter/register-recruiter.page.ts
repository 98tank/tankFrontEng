import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControlOptions } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonContent, LoadingController, ModalController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { DateInterface, User } from 'src/app/models';
import { MediaService, AuthService, FirebaseService, SharedService, ExternalApiService } from 'src/app/services';
import { PdfViewComponent } from 'src/app/shared/pdf-view/pdf-view.component';

@Component({
  selector: 'app-register-recruiter',
  templateUrl: './register-recruiter.page.html',
  styleUrls: ['./register-recruiter.page.scss'],
})
export class RegisterRecruiterPage implements OnInit {
  creando: any;
  form: FormGroup;
  dateValid = true;
  currentDate: Date;
  mailExists = false;
  currentAge: number;
  date: DateInterface;
  imgAvatar: string = null;
  area$: Observable<string[]>;
  banks$: Observable<string[]>;
  studies$: Observable<string[]>;
  @ViewChild('topPage') content: IonContent;

  constructor(
    private platform: Platform,
    private router: Router,
    private ms: MediaService,
    private auth: AuthService,
    private ss: SharedService,
    private fs: FirebaseService,
    private formBuild: FormBuilder,
    private eas: ExternalApiService,
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getAreas();
    this.getBanks();
    this.getStudies();
    this.currentDate = this.ss.getDate();
    // this.form.controls.nickname.disable();
  }

  checkPasswords(form) {
    const pass = form.get('pass').value;
    const confirm = form.get('confirm_pass').value;
    return pass === confirm ? null : { passwordsNotEqual: true };
  }

  checkEmail(form) {
    const email = form.get('email').value;
    const confirm = form.get('confirm_email').value;
    return email === confirm ? null : { emailNotEqual: true };
  }

  private buildForm() {
    this.form = this.formBuild.group({
      nickname: ['', [Validators.required, Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.pattern(/^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
      confirm_email: [''],
      confirm_pass: [''],
      address: ['', [Validators.required, Validators.minLength(2)]],
      personal_phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      curp: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18), Validators.pattern(/^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/)]],
      rfc: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(13)]],
      level_of_study: [''],
      career: [''],
      area_of_interest: ['', Validators.required],
      name_bank: ['', Validators.required],
      clabe: ['', [Validators.pattern(/^[0-9]+$/), Validators.minLength(18), Validators.maxLength(18), Validators.required]],
      account_number: ['', Validators.pattern(/^[0-9]+$/)],
    },
    {
      validator: [this.checkPasswords, this.checkEmail]
    } as AbstractControlOptions);
  }

  async uploadImg(img, canvasId) {
    if (img.target.files[0]) {
      this.imgAvatar = await this.ms.onUpload(img, canvasId, 400);
    }
  }

  async rotateImg(canvasId) {
    this.imgAvatar = await this.ms.rotateAvatar(canvasId, 400);
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

  async sendRegister(data) {
    await this.presentLoading('Creando...');
    const date: number = this.ss.getDate().getTime();
    let userError = {
      profile: {
        ...this.form.value,
        registerDate: date,
        update_Date: date,
        avatar: this.imgAvatar || '',
        birthdate: this.date,
      },
    };
    this.auth.userRegister(data.email, data.pass).then((res: any) => {
      const uid = res.user.uid;
      userError = {
        ...userError,
        profile: {
          ...userError.profile,
          uid
        }
      };
      if (uid) {
        delete data.pass;
        delete data.confirm_pass;
        delete data.confirm_email;
        const user: User = {
          profile: {
            ...data,
            uid,
            email: data.email.toLowerCase(),
            birthdate: this.date,
            registerDate: date,
            update_Date: date,
            type: 'recruiter',
            status: 'Active',
            avatar: this.imgAvatar || '',
            clabe: parseFloat(data.clabe),
            personal_phone: parseFloat(data.personal_phone),
            account_number: parseFloat(data.account_number || 0)
          }
        };
        this.fs.setDoc(`users/${uid}`, user).then(async () => {
          await this.creando.dismiss();
          this.form.reset();
          this.successfulRegistration(user.profile.email);
          this.eas.sendEmailWelcome(user.profile.email, user.profile.uid);
          // this.router.navigate(['/reclutador/principal']);
        }).catch(async (e) => {
          await this.creando.dismiss();
          this.catchError('setDoc', e, userError);
          this.content.scrollToTop(400);
          this.presentAlertConfirm();
        });
      }
    }).catch(async e => {
        await this.creando.dismiss();
        this.catchError('userRegister', e, userError);
        this.content.scrollToTop(400);
        if (e.message === 'The email address is already in use by another account.') {
          this.mailExists = true;
        }
    });
  }

  catchError(location: string, e, user: User) {
    const data = {
      location,
      user,
      active: true,
      type_user: 'recruiter',
      error: {
        code: e.code,
        message: e.message
      },
      SO: window.navigator.appVersion  || '',
      platforms: this.platform.platforms() || ''
    };
    this.fs.addDoc(`track_error`, data);
  }

  private async presentLoading(message: string) {
    this.creando = await this.loadingController.create({ message });
    await this.creando.present();
  }

  async successfulRegistration(email: string) {
    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      header: 'Registro Exitoso',
      message: `<ion-icon class="green" name="mail-unread-outline"></ion-icon> ¡Recibiras un correo en tu dirección <br> <strong>${email}</strong> para validar tu registro!`,
      mode: 'ios',
      buttons: [{
        text: 'Ok',
        handler: () => { this.router.navigate(['/login']); }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      header: 'Ocurrio un error inesperado',
      message: '<ion-icon class="red" name="trending-down-outline"></ion-icon> Por favor vuelve a intentarlo',
      mode: 'ios',
      buttons: [{
          text: 'ok',
          handler: () => { this.ss.reload(); }
        }
      ]
    });
    await alert.present();
  }

  async openContracts(file: string) {
    const modal = await this.modalController.create({
      component: PdfViewComponent,
      componentProps: {file}
    });
    return await modal.present();
  }

  buildDate(e) {
    this.date = {
      ...this.date,
      [e.type]: e.value
    };
    if (this.date?.day && this.date?.month && this.date?.year) { this.dateValid = true; }
  }

}
