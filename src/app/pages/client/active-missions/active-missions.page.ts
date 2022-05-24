import { Component, OnInit } from '@angular/core';
import { MissionData } from 'src/app/models';
import { AuthService, FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-active-missions',
  templateUrl: './active-missions.page.html',
  styleUrls: ['./active-missions.page.scss'],
})
export class ActiveMissionsPage implements OnInit {
  activeMissions: MissionData[];
  route = '/cliente/misiones-activas/mision';
  loading: boolean;

  constructor(
    private auth: AuthService,
    private fs: FirebaseService
  ) { }

  ngOnInit() {
    this.getMissionActive();
  }

  getMissionActive() {
    this.fs.getColFilter('missions', 'uid', '==', this.auth.userUid).where('status', '==', 'Activa').orderBy('create_date', 'desc').get().then(res => {
      this.activeMissions = [];
      if (res.size === 0) {
        this.loading = true;
      }
      res.forEach(d => {
        this.activeMissions.push(d.data() as MissionData);
      });
    });
  }

}
