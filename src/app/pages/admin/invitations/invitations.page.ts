import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ExternalApiService } from 'src/app/services';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.page.html',
  styleUrls: ['./invitations.page.scss'],
})
export class InvitationsPage implements OnInit {
  form: UntypedFormGroup;

  constructor(
    private buildForm: UntypedFormBuilder,
    private eas: ExternalApiService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.formBuild();
  }

  formBuild() {
    this.form = this.buildForm.group({
      mail: ['', [Validators.required, Validators.pattern(/^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)]],
      message: ['', [Validators.required, Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  async openAlerSend() {
    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      mode: 'ios',
      header: '¿Enviar invitacion?',
      backdropDismiss: false,
      message: `<ion-icon  class="yellow" name="warning"></ion-icon>Desea enviarle a <strong>${this.form.value.name}</strong> una invitacion a <strong>98Tank</strong> por medio del correo <strong>${this.form.value.mail}</strong>?`,
      buttons: [
        {
          text: 'Cerrar',
          cssClass: 'secondary',
        }, {
          text: 'Enviar',
          role: 'cancel',
          handler: async () => {
            await this.presentLoading('Enviado invitacion...');
            this.sendMail();
          }
        }
      ]
    });
    await alert.present();
  }

  async openSuccess() {
    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      mode: 'ios',
      header: 'Exito!',
      backdropDismiss: false,
      message: `<ion-icon  class="green" name="checkmark-circle"></ion-icon>Se envió correctamente la invitación a <strong>${this.form.value.name}</strong> al correo <strong>${this.form.value.mail}</strong>`,
      buttons: ['Ok']
    });
    await alert.present();
  }

  async openError() {
    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      mode: 'ios',
      header: 'Error!',
      backdropDismiss: false,
      message: `<ion-icon  class="red" name="trending-down-outline"></ion-icon>Ocurrio un error en el envío del correo, por favor vuelva a intentarlo`,
      buttons: ['Ok']
    });
    await alert.present();
  }

  async presentLoading(message: string) {
    const loading = await this.loadingController.create({ message });
    await loading.present();
  }

  async sendMail() {
    const d = this.form.value;
    const email = d.mail;
    const name = d.name;
    const message = d.message;
    const url = '';
    const subject = 'Invitación a 98Tank';
    console.log(email, name, message, url, subject);
    const notification: any = await this.eas.sendEmailReferral(email, name, message, url, subject);
    await this.loadingController.dismiss();
    console.log(notification);
    if (notification.sent) {
      await this.openSuccess();
    } else {
      this.openError();
    }
  }

}
