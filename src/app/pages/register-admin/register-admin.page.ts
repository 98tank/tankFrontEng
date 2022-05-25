import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonContent, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { User } from 'src/app/models';
import { AuthService, ExternalApiService, FirebaseService, MediaService, SharedService } from 'src/app/services';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.page.html',
  styleUrls: ['./register-admin.page.scss'],
})
export class RegisterAdminPage implements OnInit {
  creando: any;
  form: FormGroup;
  mailExists = false;
  imgAvatar: string = null;
  studies$: Observable<string[]>;
  @ViewChild('topPage') content: IonContent;

  constructor(
    private router: Router,
    private ms: MediaService,
    private auth: AuthService,
    private ss: SharedService,
    private fs: FirebaseService,
    private formBuild: FormBuilder,
    private eas: ExternalApiService,
    private alertController: AlertController,
    private loadingController: LoadingController) { }

    ngOnInit() {
      this.buildForm();
      this.getStudies();
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
        birthdate: ['', Validators.required],
        personal_phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
        curp: ['', [Validators.minLength(18), Validators.maxLength(18)]],
        rfc: ['', [Validators.minLength(12), Validators.maxLength(13)]],
        level_of_study: [''],
        career: [''],
      },
      {
        validator: [this.checkPasswords, this.checkEmail]
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

    getStudies() {
      this.studies$ = this.fs.getDocObserver('utilities/mission_fields').pipe(pluck('studies'));
    }

  getDataRegister() {
      if (this.form.valid) {
        this.sendRegister(this.form.value);
      } else {
        this.form.markAllAsTouched();
        this.content.scrollToTop(400);
      }
  }

  sendRegister(data) {
    this.presentLoading('Creando...');
    const date: number = this.ss.getDate().getTime();
    this.auth.userRegister(data.email, data.pass).then((res: any) => {
      if (res.user.uid) {
        const uid = res.user.uid;
        delete data.pass;
        delete data.confirm_pass;
        delete data.confirm_email;
        const user: User = {
          profile: {
            ...data,
            email: data.email.toLowerCase(),
            birthdate: new Date(this.form.value.birthdate).toISOString(),
            registerDate: date,
            update_Date: date,
            type: 'admin',
            status: 'Pending',
            avatar: this.imgAvatar || '',
            uid
          }
        };
        this.fs.setDoc(`users/${uid}`, user).then(async () => {
          await this.loadingController.dismiss();
          this.newAdmin();
          this.eas.sendEmailWelcome(user.profile.email, user.profile.uid);
        }).catch(async () => {
          await this.loadingController.dismiss();
          this.content.scrollToTop(400);
          this.presentAlertConfirm();
        });
      }
    }).catch(async e => {
      await this.loadingController.dismiss();
      this.content.scrollToTop(400);
      if (e.code === 'auth/email-already-in-use') {
        this.mailExists = true;
      }
    });
  }

  private async presentLoading(message: string) {
    this.creando = await this.loadingController.create({ message });
    await this.creando.present();
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

  async newAdmin() {
    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      header: 'El registro fue exitoso',
      message: `<ion-icon class="green" name="mail-unread-outline"></ion-icon> Tu cuenta esta en revisión, recibirás un correo en la direccion ${this.form.value.email} sobre el cambio de estatus.`,
      mode: 'ios',
      backdropDismiss: false,
      buttons: [{
          text: 'Ok',
        handler: () => {
          this.form.reset();
          this.router.navigate(['/login']);
        }
        }
      ]
    });
    await alert.present();
  }

}
