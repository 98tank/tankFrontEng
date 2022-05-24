import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CandidateData, MissionData } from 'src/app/models';
import { FirebaseService, MediaService } from 'src/app/services';
import { EditCandidateComponent } from 'src/app/shared/edit-candidate/edit-candidate.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.page.html',
  styleUrls: ['./candidate.page.scss'],
})
export class CandidatePage implements OnInit, OnDestroy {
  candidate: CandidateData;
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  subscription3: Subscription = new Subscription();

  constructor(
    private router: Router,
    private ms: MediaService,
    private fs: FirebaseService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getParam();
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
  }

  getParam() {
    this.subscription1 = this.route.params.subscribe(p => this.getCliente(p.id));
  }

  getCliente(uid: string) {
    this.subscription2 = this.fs.getDocObserver(`candidates/${uid}`).subscribe((c: CandidateData) => {
      if (c) {
        this.subscription3 = this.fs.getDocObserver(`missions/${c.mission_id}`).subscribe((m: MissionData) => {
          this.candidate = {
            ...c,
            name_position: m.name_position
          };
        });
      } else {
        this.router.navigate(['admin/candidatos']);
      }
    });
  }

  changeStatusClient(status: string, uid: string) {
    this.fs.updateDoc(`users/${uid}`, { 'profile.status': status });
  }

  async alertDelete(candidate: CandidateData) {
    const alert = await this.alertController.create({
      header: '¿Delete Candidate?',
      mode: 'ios',
      cssClass: 'delete-alert',
      message: `<ion-icon class="red" name="trash-outline"></ion-icon> Delete cannot be restored - Candidate information will be erased permanently including analytics, messages, files and all other related information.`,
      subHeader: `¿Confirm Candidate Database Delete?`,
      buttons: [
        {
          text: 'No',
        }, {
          text: 'Delete',
          role: 'cancel',
          handler: () => { this.delete(candidate); }
        }
      ]
    });
    await alert.present();
  }

  async openEditCandidate(candidate: CandidateData) {
    const modal = await this.modalController.create({
      component: EditCandidateComponent,
      componentProps: {candidate}
    });
    return await modal.present();
  }

  async delete(candidate: CandidateData) {
    console.log(candidate);
    await this.fs.deleteDoc(`candidates/${candidate.candidate_id}`);
    if (candidate.cv?.filePath) { this.ms.deleteImgStorage(candidate.cv.filePath); }
  }

}
