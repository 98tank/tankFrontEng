import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CandidateData, MissionData, User } from 'src/app/models';
import { AuthService, FirebaseService } from 'src/app/services';

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
  subscription4: Subscription = new Subscription();
  active = false;

  constructor(
    private router: Router,
    public auth: AuthService,
    private fs: FirebaseService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getParams();
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
  }

  goContract(c: CandidateData) {
    const user = c;
    this.router.navigate(['contratar'], {state: {data: {user}}});
  }

  getParams() {
    this.subscription1 = this.route.params.subscribe(p => this.getCandidate(p.id));
  }

  getCandidate(id: string) {
    this.subscription2 = this.fs.getDocObserver(`candidates/${id}`).subscribe((c: CandidateData) => {
      this.candidate = c;
      this.getMission(this.candidate);
    });
  }

  getMission(c: CandidateData) {
    this.subscription3 = this.auth.getAuth().subscribe(u => {
      if (u?.uid) {
        this.subscription4 = this.fs.getDocObserver(`missions/${c.mission_id}`).subscribe((m: MissionData) => {
          if (m.uid === u.uid) { this.active = true; }
          else { this.active = false; }
        });
        this.updateViewCandidate(c, u.uid);
      }
    });
  }

  async updateViewCandidate(c: CandidateData, uid: string) {
    if (!c.seen_by_the_client) {
      await this.fs.updateDoc(`candidates/${c.candidate_id}`, { seen_by_the_client: true });
      const u = await this.fs.getDoc(`users/${uid}`);
      const user: User = u.data();
      this.fs.updateDoc(`users/${uid}`, { 'statistics.new_candidates': --user.statistics.new_candidates });
    }
  }

}
