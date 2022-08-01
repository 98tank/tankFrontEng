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

  getData(event){
    event.preventDefault();
    if (this.form.valid) {
      this.openAlerSend();
    } else  {
      this.form.markAllAsTouched();
    }

  }

  async openAlerSend() {
    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      mode: 'ios',
      header: 'Send Invitation?',
      backdropDismiss: false,
      message: `<ion-icon  class="yellow" name="warning"></ion-icon>You want to send <strong>${this.form.value.name}</strong> an invitation from <strong>98Tank</strong> by email <strong>${this.form.value.mail}</strong>?`,
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'secondary',
        }, {
          text: 'Submit',
          role: 'cancel',
          handler: async () => {
            await this.presentLoading('Sending Invitation...');
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
      header: 'Success!',
      backdropDismiss: false,
      message: `<ion-icon  class="green" name="checkmark-circle"></ion-icon>The invitation was successfully sent to <strong>${this.form.value.name}</strong> to the email. <strong>${this.form.value.mail}</strong>`,
      buttons: ['Ok']
    });
    await alert.present();
  }

  async openError() {
    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      mode: 'ios',
      header: 'Mistake!',
      backdropDismiss: false,
      message: `<ion-icon  class="red" name="trending-down-outline"></ion-icon>There was an error sending the email, please try again`,
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
    const subject = 'Invitation to 98Tank';
    const notification: any = await this.eas.sendEmailReferral(email, name, message, url, subject);
    await this.loadingController.dismiss();
    if (notification.sent) {
      await this.openSuccess();
    } else {
      this.openError();
    }
  }

}
