import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { CandidateData } from 'src/app/models';
import { AuthService, FirebaseService, MediaService } from 'src/app/services';
import { EditCandidateComponent } from 'src/app/shared/edit-candidate/edit-candidate.component';

@Component({
  selector: 'app-candidate-recruiter',
  templateUrl: './candidate-recruiter.page.html',
  styleUrls: ['./candidate-recruiter.page.scss'],
})
export class CandidateRecruiterPage implements OnInit, OnDestroy {
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  candidate$: Observable<any>;

  constructor(
    private router: Router,
    public auth: AuthService,
    private ms: MediaService,
    private fs: FirebaseService,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.getParams();
  }

  ngOnDestroy(): void {
    this.subscription1.add(this.subscription2);
    this.subscription1.unsubscribe();
  }

  getParams() {
    this.subscription1 = this.route.params.subscribe(p => this.getCandidate(p.id));
  }

  getCandidate(id: string) {
    this.candidate$ = this.fs.getDocObserver(`candidates/${id}`);
  }

  async openEditCandidate(candidate: CandidateData) {
    const modal = await this.modalController.create({
      component: EditCandidateComponent,
      componentProps: {candidate}
    });
    return await modal.present();
  }

  async openAlertDelete(candidate: CandidateData, missionId: string) {
    const alert = await this.alertController.create({
      header: 'Borrar',
      mode: 'ios',
      cssClass: 'delete-alert',
      message: `<ion-icon class="yellow" name="warning"></ion-icon> El candidato sera borrado permanentemente de nuestra base de datos.`,
      buttons: [
        { text: 'Salir', role: 'cancel' },
        { text: 'Eliminar', handler: () => this.deleteCandidate(candidate, missionId) }
      ]
    });
    await alert.present();
  }

  deleteCandidate(candidate: CandidateData, missionId: string) {
    const route = `/reclutador/misiones-activas/mision/${missionId}`;
    if (candidate.cv?.filePath) { this.ms.deleteImgStorage(candidate.cv.filePath); }
    this.fs.deleteDoc(`candidates/${candidate.candidate_id}`);
    this.router.navigate([route]);
  }

}
