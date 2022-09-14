import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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

  form: UntypedFormGroup;
  loginError = false;
  subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private auth: AuthService,
    private fs: FirebaseService,
    private formBuild: UntypedFormBuilder,
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
      await this.presentLoading('Authenticating...');
      this.auth.loginEmail(this.form.value.email, this.form.value.pass).then((res) => {
        if (res.user.emailVerified === true) {
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
              } else if (p.status === 'Block') {
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
      header: 'You must first verify your account',
      subHeader: `Check your email inbox to validate your registration, do not forget to check your spam folder!`,
      message: '<ion-icon class="green" name="mail-outline"></ion-icon> Send the code again?',
      backdropDismiss: false,
      mode: 'ios',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => { this.auth.logout(); }
      }, {
        text: 'Submit',
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
      header: 'This user has been blocked',
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
      header: 'Incorrect data!',
      message: '<ion-icon class="red" name="close-circle-outline"></ion-icon> Please try again',
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
      header: 'Forgot Password?',
      mode: 'ios',
      message: '<ion-icon class="green" name="mail-outline"></ion-icon> Please enter your email to sent instructions',
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
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { },
        },
        {
          text: 'Submit',
          handler: (e) => {
            if (e.email) { this.eas.sendEmailNotification( e.email, 'reset'); }
           }
        },
      ],
    });
    await alert.present();
  }

}
