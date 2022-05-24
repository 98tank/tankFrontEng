import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models';
import { FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-recruiter-data',
  templateUrl: './recruiter-data.component.html',
  styleUrls: ['./recruiter-data.component.scss'],
})
export class RecruiterDataComponent implements OnInit {
  @Input() uid: string;
  recruiter$: Observable<User>;

  constructor(
    private fs: FirebaseService
  ) { }

  ngOnInit() {
    this.getRecruiter();
  }

  getRecruiter() {
    this.recruiter$ = this.fs.getDocObserver(`users/${this.uid}`);
  }


}
