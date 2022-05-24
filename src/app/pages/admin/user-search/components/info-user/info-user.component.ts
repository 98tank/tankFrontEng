import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Profile, User } from 'src/app/models';
import { ExternalApiService } from 'src/app/services';

@Component({
  selector: 'app-info-user',
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.scss'],
})
export class InfoUserComponent implements OnInit {
  @Input() user: User;
  @Input() missions: Array<number>;
  @Input() candidates: Array<number>;
  @Output() type = new EventEmitter<string>();
  @Output() noUser = new EventEmitter<boolean>();

  constructor(
    private eas: ExternalApiService,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() { }

  emitType(t) {
    this.type.emit(t.detail.value);
  }

  async openAlertDetele(p: Profile) {
    const alert = await this.alertController.create({
      mode: 'ios',
      cssClass: 'delete-alert',
      header: 'BORRAR USUARIO!',
      message: `<ion-icon  class="yellow" name="warning"></ion-icon> El borrado es irreversible, y eliminara toda la data relacionada al usuario <strong>${p.email}</strong>, incluyendo la analítica, mensajes, archivos, candidatos y cualquier otra información que lo relacione a él.`,
      subHeader: `¿Desea borrar definitivamente el usuario ${p.email} de la base de datos?`,
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'secondary',
        }, {
          text: 'Borrar',
          role: 'cancel',
          handler: () => { this.deleteUser(p); }
        }
      ]
    });
    await alert.present();
  }

  async deleteUser(p: Profile) {
    await this.presentLoading('Borrando Usuario');
    const resDelete = await this.eas.deleteUser(p.uid, p.type);
    await this.loadingController.dismiss();
    console.log({resDelete});
    !resDelete ? this.alertError() : this.alertSuccess();
  }

  async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
      mode: 'ios'
    });
    await loading.present();
  }

  async alertSuccess() {
    const alert = await this.alertController.create({
      header: 'Exito',
      cssClass: 'delete-alert',
      backdropDismiss: false,
      mode: 'ios',
      message: '<ion-icon class="green" name="checkmark-circle-outline"></ion-icon>El usuario ha sido borrado exitosamente de la base de datos',
      buttons: [{
        text: 'Ok',
        role: 'cancel',
        handler: () => this.noUser.emit(true)
      }]
    });
    await alert.present();
  }

  async alertError() {
    const alert = await this.alertController.create({
      header: 'Error',
      cssClass: 'delete-alert',
      mode: 'ios',
      message: '<ion-icon class="red" name="trending-down-outline"></ion-icon>Ocurrio un error inesperado, por favor vuelva a intentarlo',
      buttons: ['OK']
    });
    await alert.present();
  }

}
