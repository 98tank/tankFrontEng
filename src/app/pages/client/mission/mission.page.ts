import { Component, OnInit } from '@angular/core';
import { AuthService, FirebaseService, SharedService } from 'src/app/services';
import { Observable, Subscription } from 'rxjs';
import { MissionData } from 'src/app/models';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { EditMissionComponent } from 'src/app/shared/edit-mission/edit-mission.component';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.page.html',
  styleUrls: ['./mission.page.scss'],
})
export class MissionPage implements OnInit {
  mission$: Observable<MissionData>;
  subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    public auth: AuthService,
    private ss: SharedService,
    private route: ActivatedRoute,
    private fs: FirebaseService,
    private alertController: AlertController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getParam();
  }

  getParam() {
    this.subscription = this.route.params.subscribe(p => this.getMission(p.id));
  }

  getMission(id: string) {
    this.mission$ = this.fs.getDocObserver(`missions/${id}`);
  }

  async cancelMission(mission: MissionData) {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to Cancel the mission?',
      message: 'Press OK to Cancel Mission',
      mode: 'ios',
      buttons: [
        { text: 'Exit', role: 'Cancel' },
        { text: 'OK', handler: () => { this.canceledMission(mission); } }
      ]
    });
    await alert.present();
  }

  canceledMission(mission: MissionData) {
    const date = this.ss.getDate().getTime();
    this.fs.updateDoc(`missions/${mission.mission_id}`, { status: 'Cancelled', update_date: date })
      .then(() => this.router.navigate(['/cliente/misiones-canceladas']));
  }

  async editMission(mission: MissionData) {
    const modal = await this.modalController.create({
      component: EditMissionComponent,
      componentProps: {mission}
    });
    return await modal.present();
  }

}
