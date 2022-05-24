import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MissionData } from 'src/app/models';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-mission-data',
  templateUrl: './mission-data.component.html',
  styleUrls: ['./mission-data.component.scss'],
})
export class MissionDataComponent implements OnInit, OnDestroy {
  @Input() contracted: string;
  @Input() mission: MissionData;
  subscription: Subscription = new Subscription();

  constructor(
    private fs: FirebaseService
  ) { }

  ngOnInit() {
    this.getNameCompany();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getNameCompany() {
    this.subscription = this.fs.getDocObserver(`users/${this.mission.uid}`).pipe(pluck('profile', 'company_name')).subscribe((cn: string) => {
      this.mission = {
        ...this.mission,
        company_name: cn
      };
    });
  }

}
