import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, ExternalApiService, FirebaseService } from 'src/app/services';
import { pluck, take } from 'rxjs/operators';
import { AlertController, LoadingController } from '@ionic/angular';
import { Profile } from 'src/app/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  form: FormGroup;
  loginError = false;
  subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private auth: AuthService,
    private fs: FirebaseService,
    private formBuild: FormBuilder,
    private eas: ExternalApiService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.auth.logout();
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private buildForm() {
    this.form = this.formBuild.group({
      email: ['', [Validators.required, Validators.pattern(/^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)]],
      pass: ['', [Validators.required, , Validators.minLength(6)]]
    });
  }

  async getDataLogin() {
    if (this.form.valid) {
      await this.presentLoading('Autenticando...');
      this.auth.loginEmail(this.form.value.email, this.form.value.pass).then((res) => {
        if (res.user.emailVerified === false) {
          if (res.user.uid) {
            const uid = res.user.uid;
            this.subscription = this.fs.getDocObserver(`users/${uid}`).pipe(pluck('profile'), take(1)).subscribe(async (p: Profile) => {
              await this.loadingController.dismiss();
              if (p.status === 'Active') {
                this.form.reset();
                if (p.type === 'client') { this.router.navigate(['/cliente/principal']); }
                if (p.type === 'recruiter') { this.router.navigate(['/reclutador/principal']); }
                if (p.type === 'admin') { this.router.navigate(['/admin/principal']); }
                if (p.type === 'superAdmin') { this.router.navigate(['/admin/principal']); }
              } else {
                this.userBlocked().then(() => this.auth.logout());
              }
            });
          }
        } else { this.notVerified(); }
      }).catch((e) => this.presentAlertConfirm());
    }
  }

  async notVerified() {
    this.loadingController.dismiss();
    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      header: 'Primero debes verificar tu cuenta',
      subHeader: `¡Revisa la bandeja de entrada en tu correo para validar tu registro!`,
      message: '<ion-icon class="green" name="mail-outline"></ion-icon> ¿Enviar nuevamente el codigo?',
      backdropDismiss: false,
      mode: 'ios',
      buttons: [{
        text: 'Salir',
        role: 'cancel',
        handler: () => { this.auth.logout(); }
      }, {
        text: 'Enviar',
        handler: () => {
          this.auth.sendEmailVerification().then(() => this.auth.logout() );
        }
      }]
    });
    await alert.present();
  }

  async userBlocked() {
    this.loadingController.dismiss();
    const alert = await this.alertController.create({
      header: 'Esta usuario a sido bloqueado',
      mode: 'ios',
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlertConfirm() {
    this.loadingController.dismiss();
    this.auth.logout();
    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      header: 'Los datos son incorrectos!!!',
      message: '<ion-icon class="red" name="close-circle-outline"></ion-icon> Por favor vuelve a intentarlo',
      mode: 'ios',
      buttons: ['OK']
    });
    await alert.present();
  }

  private async presentLoading(message: string) {
    const creando = await this.loadingController.create({ message });
    await creando.present();
  }

  async resetPassword() {
    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      header: '¿Has olvidado tu contraseña?',
      mode: 'ios',
      message: '<ion-icon class="green" name="mail-outline"></ion-icon> ¡Le enviaremos un correo electrónico con instrucciones!',
      inputs: [
        {
          name: 'email',
          type: 'email',
          label: 'email',
          placeholder: 'email',
          value: '',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { },
        },
        {
          text: 'Enviar',
          handler: (e) => {
            if (e.email) { this.eas.sendEmailNotification( e.email, 'reset'); }
           }
        },
      ],
    });
    await alert.present();
  }

}
