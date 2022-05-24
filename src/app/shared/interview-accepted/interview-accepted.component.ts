import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CandidateData, Interview, MissionData, User } from 'src/app/models';
import { FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-interview-accepted',
  templateUrl: './interview-accepted.component.html',
  styleUrls: ['./interview-accepted.component.scss'],
})
export class InterviewAcceptedComponent implements OnInit, OnDestroy {
  @Input() candidate: CandidateData;
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  interviewData: any;

  constructor(
    private fs: FirebaseService
  ) { }

  ngOnInit() {
    this.buildData();
  }

  ngOnDestroy(): void {
    this.subscription1.add(this.subscription2);
    this.subscription1.unsubscribe();
  }

  buildData() {
    this.subscription1 = this.fs.getDocObserver(`missions/${this.candidate.mission_id}`).subscribe((m: MissionData) => {
      this.interviewData = {
        ...this.interviewData,
        position: m.name_position,
      };
    });
    this.subscription2 = this.fs.getDocObserver(`users/${this.candidate.uid_recruiter}`).subscribe((r: User) => {
      this.interviewData = {
        ...this.interviewData,
        name_recruiter: r.profile.name
      };
    });
  }

}
