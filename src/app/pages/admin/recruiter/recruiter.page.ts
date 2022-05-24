import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Profile } from 'src/app/models';
import { FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-recruiter',
  templateUrl: './recruiter.page.html',
  styleUrls: ['./recruiter.page.scss'],
})
export class RecruiterPage implements OnInit {
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
      header: 'Activate this Recruiter?',
      mode: 'ios',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        }, {
          text: 'Yes',
          handler: () => {
            this.fs.updateDoc(`users/${uid}`, {'profile.status': 'Activo'})
          }
        }
      ]
    });
    await alert.present();
  }

  async blockUser(uid: string) {
    const alert = await this.alertController.create({
      header: 'Block this Recruiter?',
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
            this.fs.updateDoc(`users/${uid}`, {'profile.status': 'Bloqueado', 'profile.reason_block': d.reason_block || ''});
          }
        }
      ]
    });
    await alert.present();
  }

}
