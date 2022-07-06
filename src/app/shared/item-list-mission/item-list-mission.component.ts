import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { MissionData, CandidateData, RequestRefound, Reward } from 'src/app/models';
import { FirebaseService, MediaService } from 'src/app/services';

@Component({
  selector: 'app-item-list-mission',
  templateUrl: './item-list-mission.component.html',
  styleUrls: ['./item-list-mission.component.scss'],
})
export class ItemListMissionComponent implements OnInit {
  @Input() missions: MissionData[];
  @Input() dateTitle: string;
  @Input() field1: string;
  @Input() delete: boolean;
  @Output() reload = new EventEmitter<boolean>();
  id: string = null;

  constructor(
    private ms: MediaService,
    private fs: FirebaseService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() { }

  mouseEnter(event) {
    this.id = event;
  }

  mouseLeave(event) {
    this.id = event;
  }

  async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
    });
    await loading.present();
  }

  async openAlertDetele(mission: MissionData) {
    const alert = await this.alertController.create({
      mode: 'ios',
      cssClass: 'delete-alert',
      header: 'MISSION DELETE!',
      message: `<ion-icon class="yellow" name="warning-outline"></ion-icon> The deletion is irreversible, and will remove all data related to the mission <strong>${mission.name_position}</strong>, including analytics, messages, files, candidates and any other information that users may generate through said mission.`,
      subHeader: `You want to permanently delete the mission ${mission.name_position} from the database?`,
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'secondary',
        }, {
          text: 'Delete',
          role: 'cancel',
          handler: async () => {
            await this.presentLoading('Deleting Mission');
            this.deleteMission(mission);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteMission(mission: MissionData) {
    // borrar:
    // mission de "missions"
    // candidatos de esa mision de "candidates"
    // borrar cv de los candidatos del storage.
    // solicitudes de reembolso de "request_refound"
    // borrar pay de la mision del storage.
    // recompensa de la mision desde "reward"
    const candidatesIds: string[] = [];
    const cvCandidates: string[] = [];
    const requestR: string[] = [];
    const rewardR: string[] = [];
    const pathPay: string = mission.pay?.filePath || null;
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;
    this.fs.getColFilter('candidates', 'mission_id', '==', mission.mission_id).get().then(res => {
      if (res.size > 0) {
        res.forEach(d => {
          ++counter1;
          const c: CandidateData = d.data() as CandidateData;
          candidatesIds.push(c.candidate_id);
          if (c.cv?.filePath) { cvCandidates.push(c.cv.filePath); }
          if (counter1 === res.size) {
            candidatesIds.forEach(candID => this.fs.deleteDoc(`candidates/${candID}`));
            cvCandidates.forEach(candCV => this.ms.deleteImgStorage(candCV));
          }
        });
      }
    });
    this.fs.getColFilter('request_refound', 'mission_id', '==', mission.mission_id).get().then(res => {
      if (res.size > 0) {
        res.forEach(d => {
          ++counter2;
          requestR.push(d.id);
          if (counter2 === res.size) { requestR.forEach(rrID => this.fs.deleteDoc(`request_refound/${rrID}`)); }
        });
      }
    });
    this.fs.getColFilter('reward', 'mission_id', '==', mission.mission_id).get().then(res => {
      if (res.size > 0) {
        res.forEach(d => {
          ++counter3;
          rewardR.push(d.id);
          if (counter3 === res.size) { rewardR.forEach(rwID => this.fs.deleteDoc(`reward/${rwID}`)); }
        });
      }
    });
    setTimeout(() => {
      this.fs.deleteDoc(`missions/${mission.mission_id}`).then(d => {
        if (pathPay) { this.ms.deleteImgStorage(pathPay); }
        this.loadingController.dismiss();
        this.reload.emit(true);
      });
    }, 2000);
  }

}
