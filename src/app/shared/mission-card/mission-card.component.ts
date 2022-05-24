import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Commissions, MissionData } from 'src/app/models';
import { FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-mission-card',
  templateUrl: './mission-card.component.html',
  styleUrls: ['./mission-card.component.scss'],
})
export class MissionCardComponent implements OnInit {
  @Input() type: string;
  @Input() route: string;
  @Input() mission: MissionData;
  c$: Observable<Commissions>;

  constructor(
    private fs: FirebaseService
  ) { }

  ngOnInit() {
    this.c$ = this.fs.commission$;
  }

}
