import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { MissionData, User, CandidateData } from 'src/app/models';
import { FirebaseService, SharedService } from 'src/app/services';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.page.html',
  styleUrls: ['./user-search.page.scss'],
})
export class UserSearchPage implements OnInit {
  userSearch: User;
  missions: Array<number>;
  candidates: Array<number>;
  email: string | number;

  constructor(
    public ss: SharedService,
    public fs: FirebaseService,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
  }

  async getUser(email: string | number) {
    this.email = email;
    await this.presentLoading();
    const dataFirebaseUser = await this.fs.getColFilter('users', 'profile.email', '==', email).get();
    await this.loadingController.dismiss();
    if (!dataFirebaseUser.empty) {
      dataFirebaseUser.forEach(d => {
        this.userSearch = d.data() as User;
        if (this.userSearch.profile.type === 'client') {
          this.candidates = null;
          this.getMissions(this.userSearch.profile.uid);
        } else if (this.userSearch.profile.type === 'recruiter') {
          this.missions = null;
          this.getCandidates(this.userSearch.profile.uid);
        } else {
          this.missions = null;
          this.candidates = null;
        }
      });
    }
    else {
      this.presentAlert(email);
      this.userSearch = null;
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      mode: 'ios',
      message: 'Searching...',
    });
    await loading.present();
  }

  async presentAlert(email: string | number) {
    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      mode: 'ios',
      header: 'DOES NOT EXIST!',
      message: `<ion-icon class="red" name="close-circle-outline"></ion-icon> The mail <strong>${email}</strong>, does not belong to our database.`,
      buttons: ['OK']
    });
    await alert.present();
  }

  async getMissions(id: string) {
    let counter = 0;
    let active = 0;
    let completed = 0;
    let pending = 0;
    let cancelled = 0;
    const dataFirebaseMissions = await this.fs.getColFilter('missions', 'uid', '==', id).get();
    if (dataFirebaseMissions.size > 0) {
      this.missions = [0, 0, 0, 0];
      dataFirebaseMissions.forEach(d => {
        ++counter;
        const m: MissionData = d.data() as MissionData;
        if (m.status === 'Active') { ++active; }
        if (m.status === 'Accomplished') { ++completed; }
        if (m.status === 'Pending') { ++pending; }
        if (m.status === 'Cancelled') { ++cancelled; }
        if (counter === dataFirebaseMissions.size) {
          this.missions = [active, completed, cancelled, pending];
         }
      });
    }
  }

  async getCandidates(id: string) {
    let counter = 0;
    let active = 0;
    let hired = 0;
    let discarded = 0;
    const dataFirebaseMissions = await this.fs.getColFilter('candidates', 'uid_recruiter', '==', id).get();
    if (dataFirebaseMissions.size > 0) {
      this.candidates = [0, 0, 0];
      dataFirebaseMissions.forEach(d => {
        ++counter;
        const m: CandidateData = d.data() as CandidateData;
        if (m.status === 'Active') { ++active; }
        if (m.status === 'Hired') { ++hired; }
        if (m.status === 'Discarded') { ++discarded; }
        if (counter === dataFirebaseMissions.size) {
          this.candidates = [active, hired, discarded];
         }
      });
    }
  }

  async chanceTypeUser(t: string) {
    const date: number = this.ss.getDate().getTime();
    await this.fs.updateDoc(`users/${this.userSearch.profile.uid}`, { 'profile.type': t,  'profile.update_Date': date});
    this.getUser(this.email);
  }

  resetUser() {
    this.userSearch = null;
  }

}
