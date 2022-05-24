import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { pluck, tap } from 'rxjs/operators';
import { User, CandidateData } from 'src/app/models';
import { FirebaseService, AuthService } from 'src/app/services';

@Component({
  selector: 'app-users-admin',
  templateUrl: './users-admin.page.html',
  styleUrls: ['./users-admin.page.scss'],
})
export class UsersAdminPage implements OnInit, OnDestroy {
  usersAdmin: User[];
  typeAdmin$: Observable<string>;
  subscriptions: Subscription = new Subscription();
  delete: boolean;

  constructor(
    private auth: AuthService,
    private fs: FirebaseService,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.getAdmins();
    this.getTypeAdmin();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  trackByFn(index: number): number {
    return index;
  }

  getTypeAdmin() {
    this.subscriptions = this.auth.getAuth().subscribe(u => {
      if (u?.uid) {
        this.typeAdmin$ = this.fs.getDocObserver(`users/${u.uid}`).pipe(pluck('profile', 'type'));
      }
    });
  }

  getAdmins() {
    this.usersAdmin = [];
    this.fs.getColFilter('users', 'profile.type', 'in', ['admin', 'superAdmin']).orderBy('profile.registerDate', 'desc').get().then(r => {
      if (r.size > 0) {
        r.forEach(d => this.usersAdmin.push(d.data() as User) );
      }
    });
  }

  async moderar(u: User) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Selecciones la accion que desea realizar',
      cssClass: 'emergente',
      mode: 'ios',
      buttons: [ {
        cssClass: 'activate',
        text: 'Activar',
        icon: 'checkmark-circle-sharp',
        handler: () => {
          this.fs.updateDoc(`users/${u.profile.uid}`, {'profile.status': 'Active'}).then(() => this.getAdmins());
        }
      }, {
        text: 'Bloquear',
        role: 'destructive',
        icon: 'cloud-offline',
          handler: () => {
          this.fs.updateDoc(`users/${u.profile.uid}`, {'profile.status': 'Block'}).then(() => this.getAdmins());
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }


  async deleteDates() {
    let counter1 = 0;
    const idUser: string[] = [];
    const dataUser = await this.fs.afs.firestore.collection('users').get();
    if (dataUser.size > 0) {
      dataUser.forEach(d => {
        ++counter1;
        const u: User = d.data() as User;
        idUser.push(u.profile.uid);
        if (dataUser.size === counter1) {
          console.log('Borrar users', idUser);
          idUser.forEach(async id => await this.fs.deleteField(`users/${id}`, 'profile.birthdate'));
        }
      });
    }
    let counter2 = 0;
    const idCandidates: string[] = [];
    const dataCandidates = await this.fs.afs.firestore.collection('candidates').get();
    if (dataCandidates.size > 0) {
      dataCandidates.forEach(d => {
        ++counter2;
        const u: CandidateData = d.data() as CandidateData;
        idCandidates.push(u.candidate_id);
        if (dataCandidates.size === counter2) {
          console.log('Borrado Candidatos', idCandidates);
          idCandidates.forEach(async id => await this.fs.deleteField(`candidates/${id}`, 'birthdate'));
        }
      });
    }
  }

}
