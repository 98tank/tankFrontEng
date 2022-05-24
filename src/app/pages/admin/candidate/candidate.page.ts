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
      header: '¿Borrar Candidato?',
      mode: 'ios',
      cssClass: 'delete-alert',
      message: `<ion-icon class="red" name="trash-outline"></ion-icon> El borrado es irreversible, y eliminara toda la data del candidato <strong>${candidate.name}</strong>, incluyendo la analítica, mensajes, archivos y cualquier otra información relacionada a él.`,
      subHeader: `¿Desea borrar definitivamente el candidato ${candidate.name} de la base de datos?`,
      buttons: [
        {
          text: 'No',
        }, {
          text: 'Borrar',
          role: 'cancel',
          handler: () => { this.delete(candidate); }
        }
      ]
    });
    await alert.present();
  }

  async blockUser(uid: string) {
    const alert = await this.alertController.create({
      header: '¿Bloquear Cliente?',
      mode: 'ios',
      inputs: [{
        name: 'reason_block',
        type: 'text',
        placeholder: 'Motivo del bloqueo'
      }],
      buttons: [
        {
          text: 'No',
        }, {
          text: 'Si',
          role: 'cancel',
          handler: (d) => {
            this.fs.updateDoc(`users/${uid}`, {'profile.status': 'Block', 'profile.reason_block': d.reason_block || ''});
          }
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
