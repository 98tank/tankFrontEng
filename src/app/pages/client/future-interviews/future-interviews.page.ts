import { Component, OnInit } from '@angular/core';
import { CandidateData, Option } from 'src/app/models';
import { AuthService, FirebaseService, SharedService } from 'src/app/services';

@Component({
  selector: 'app-future-interviews',
  templateUrl: './future-interviews.page.html',
  styleUrls: ['./future-interviews.page.scss'],
})
export class FutureInterviewsPage implements OnInit {
  candidates: CandidateData[] = [];

  constructor(
    private ss: SharedService,
    private auth: AuthService,
    private fs: FirebaseService
  ) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.auth.getAuth().subscribe(u => {
      if (u?.uid) {
        this.getMyMissions(u.uid);
      }
    });
  }

  getMyMissions(uid: string) {
    const missionsIDS: string[] = [];
    let counter = 0;
    this.fs.getColFilter('missions', 'uid', '==', uid).where('status', '==', 'Activa').get().then(res => {
      if (res.size > 0) {
        res.forEach(d => {
          ++counter;
          missionsIDS.push(d.data().mission_id);
          if (res.size === counter) {
            this.getCandidates(missionsIDS);
          }
        });
      }
    });
  }

  getCandidates(missionsIDS: string[]) {
    const correntDate: number = this.ss.getDate().getTime();
    this.fs.getColFilter('candidates', 'mission_id', 'in', missionsIDS).where('interview.status', '==', 'selected').get().then(r => {
      if (r.size > 0) {
        r.forEach(d => {
          const c: Option[] = d.data().interview.options;
          c.forEach(o => {
            if (o.selected) {
              const hours = new Date(o.date);
              const date = new Date(o.date);
              const DD = date.getDate();
              const MM = date.getMonth();
              const YYYY = date.getFullYear();
              const HH = hours.getHours();
              const mm = hours.getMinutes();
              const ss = hours.getSeconds();
              const sss = hours.getMilliseconds();
              const interviewDay = new Date(YYYY, MM, DD, HH, mm, ss, sss).getTime();
              if (correntDate < interviewDay) { this.candidates.push(d.data() as CandidateData); }
            }
          });
        });
      }
    });
  }

}
