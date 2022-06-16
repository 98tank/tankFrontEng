import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControlOptions } from '@angular/forms';
import { AuthService, ExternalApiService, FirebaseService, MediaService, SharedService } from 'src/app/services';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { IonContent, LoadingController, AlertController, Platform, ModalController } from '@ionic/angular';
import { User } from 'src/app/models';
import { PdfViewComponent } from 'src/app/shared/pdf-view/pdf-view.component';

@Component({
  selector: 'app-register-client',
  templateUrl: './register-client.page.html',
  styleUrls: ['./register-client.page.scss'],
})
export class RegisterClientPage implements OnInit {
  creando: any;
  form: UntypedFormGroup;
  mailExists = false;
  imgAvatar: string = null;
  banks$: Observable<string[]>;
  sector$: Observable<string[]>;
  giro$: Observable<string[]>;
  @ViewChild('topPage') content: IonContent;

  constructor(
    private platform: Platform,
    private router: Router,
    private ms: MediaService,
    private auth: AuthService,
    private ss: SharedService,
    private fs: FirebaseService,
    private formBuild: UntypedFormBuilder,
    private eas: ExternalApiService,
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.auth.logout();
    this.buildForm();
    this.getBanks();
    this.getGiro();
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
      company_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.pattern(/^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)]],
      confirm_email: [''],
      confirm_pass: [''],
      pass: ['', [Validators.required, Validators.minLength(6)]],
      business_name: ['', [Validators.required, Validators.minLength(2)]],
      rfc: ['', [Validators.minLength(12), Validators.maxLength(13)]],
      address: ['', [Validators.required, Validators.minLength(2)]],
      phone_company: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      extension: ['', Validators.pattern(/^[0-9]+$/)],
      name_contact: ['', Validators.required],
      personal_phone: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      giro: ['', Validators.required],
      name_bank: ['', Validators.required],
      clabe: ['', [Validators.pattern(/^[0-9]+$/), Validators.minLength(18), Validators.maxLength(18), Validators.required]],
      account_number: ['', Validators.pattern(/^[0-9]+$/)],
    },
    {
      validator: [this.checkPasswords, this.checkEmail]
      } as AbstractControlOptions,
    );
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
    this.mailExists = false;
    if (this.form.valid) {
      this.sendRegister(this.form.value);
    } else {
      this.content.scrollToTop(400);
      this.form.markAllAsTouched();
    }
  }

  async sendRegister(data) {
    await this.presentLoading('Creando...');
    const date: number = this.ss.getDate().getTime();
    let userError = {
      profile: {
        ...this.form.value,
        registerDate: date,
        avatar: this.imgAvatar || '',
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
            registerDate: date,
            type: 'client',
            status: 'Active',
            avatar: this.imgAvatar || '',
            clabe: parseFloat(data.clabe),
            phone_company: parseFloat(data.phone_company || 0),
            personal_phone: parseFloat(data.personal_phone || 0),
            account_number: parseFloat(data.account_number || 0)
          }
        };
        this.fs.setDoc(`users/${uid}`, user).then( async () => {
          await this.creando.dismiss();
          this.form.reset();
          this.successfullRegistration(user.profile.email);
          this.eas.sendEmailWelcome(user.profile.email, user.profile.uid);
          // this.router.navigate(['/cliente/principal']);
        }).catch(async e => {
          await this.creando.dismiss();
          this.catchError('setDoc', e, userError);
          this.content.scrollToTop(400);
          this.presentAlertConfirm();
        });
      }
    }).catch( async e => {
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
      type_user: 'client',
      error: {
        code: e.code,
        message: e.message
      },
      SO: window.navigator.appVersion  || '',
      platforms: this.platform.platforms() || ''
    };
    console.log(e);
    console.log(data);
    this.fs.addDoc(`track_error`, data);
  }

  getBanks() {
    this.banks$ = this.ss.getDataJsonLocal('', 'assets/data/banks.json').pipe(pluck('banks'));
  }

  private async presentLoading(message: string) {
    this.creando = await this.loadingController.create({ message });
    await this.creando.present();
  }

  async successfullRegistration(email: string) {
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

  // getSector() {
  //   this.sector$ = this.fs.getDocObserver('utilities/register_client').pipe(pluck('sectors'));
  // }

  getGiro() {
    this.giro$ = this.fs.getDocObserver('utilities/register_client').pipe(pluck('giros'));
  }

  async openContracts(file: string) {
    const modal = await this.modalController.create({
      component: PdfViewComponent,
      componentProps: {file}
    });
    return await modal.present();
  }

}
