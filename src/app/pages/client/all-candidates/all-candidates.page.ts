import { Component } from '@angular/core';
import { AuthService, FirebaseService } from 'src/app/services';
import { CandidateData } from 'src/app/models';

@Component({
  selector: 'app-all-candidates',
  templateUrl: './all-candidates.page.html',
  styleUrls: ['./all-candidates.page.scss'],
})
export class AllCandidatesPage {
  allCandidates: CandidateData[];

  constructor(
    private auth: AuthService,
    private fs: FirebaseService,
  ) { }

  ionViewWillEnter() {
    this.getUser();
  }

  getUser() {
    this.auth.getAuth().subscribe(u => {
      if (u?.uid) {
        this.getMyCandidates(u.uid);
      }
    });
  }

  async getMyCandidates(uid: string) {
    const arrayTemp: CandidateData[] = [];
    const snapShotCancidates = await this.fs.getCollectionWithOrder('candidates').where('uid_client', '==', uid).orderBy('create_date', 'desc').get();
    if (snapShotCancidates.size > 0) {
      snapShotCancidates.docs.forEach((d, idx, arr) => {
        arrayTemp.push(d.data() as CandidateData);
        if (idx + 1 === arr.length) { this.allCandidates = arrayTemp; }
      });
    }
  }

  trackByFn(index: number): number {
    return index;
  }

}
