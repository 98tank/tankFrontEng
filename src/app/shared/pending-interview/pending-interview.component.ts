import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CandidateData, Interview, MissionData, Option, User } from 'src/app/models';
import { FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-pending-interview',
  templateUrl: './pending-interview.component.html',
  styleUrls: ['./pending-interview.component.scss'],
})
export class PendingInterviewComponent implements OnInit {
  @Input() recruiter: boolean;
  @Input() candidate: CandidateData;
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  interviewData: any;

  constructor(
    private fs: FirebaseService) { }

  ngOnInit() {
    this.buildData();
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

  selectInterviewDate(index: number) {
    const option: Option = {
      ...this.candidate.interview.options[index],
      selected: true
    };
    this.candidate.interview.options.splice(index, 1, option);
    this.fs.updateDoc(`candidates/${this.candidate.candidate_id}`, {'interview.status': 'selected', 'interview.options': this.candidate.interview.options });
  }

}
