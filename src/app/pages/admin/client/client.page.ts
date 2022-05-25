import { Observable, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services';
import { Profile } from 'src/app/models';
import { pluck } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-client',
  templateUrl: './client.page.html',
  styleUrls: ['./client.page.scss'],
})
export class ClientPage implements OnInit, OnDestroy {
  profile: Observable<Profile>;
  subscription: Subscription = new Subscription();

  constructor(
    private fs: FirebaseService,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.getParam();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getParam() {
    this.subscription = this.route.params.subscribe(p => this.getCliente(p.id));
  }

  getCliente(uid: string) {
    this.profile = this.fs.getDocObserver(`users/${uid}`).pipe(pluck('profile'));
  }

  changeStatusClient(status: string, uid: string) {
    this.fs.updateDoc(`users/${uid}`, {'profile.status': status})
  }

  async activeUser(uid: string) {
    const alert = await this.alertController.create({
      header: '¿Activate Client?',
      mode: 'ios',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        }, {
          text: 'Yes',
          handler: () => {
            this.fs.updateDoc(`users/${uid}`, {'profile.status': 'Active'})
          }
        }
      ]
    });
    await alert.present();
  }

  async blockUser(uid: string) {
    const alert = await this.alertController.create({
      header: 'Block this Client?',
      mode: 'ios',
      inputs: [{
        name: 'reason_block',
        type: 'text',
        placeholder: 'Reason for blocking'
      }],
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        }, {
          text: 'Yes',
          handler: (d) => {
            this.fs.updateDoc(`users/${uid}`, {'profile.status': 'Block', 'profile.reason_block': d.reason_block || ''});
          }
        }
      ]
    });
    await alert.present();
  }

}
