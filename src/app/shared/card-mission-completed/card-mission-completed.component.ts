import { Component, Input, OnInit } from '@angular/core';
import { MissionData } from 'src/app/models';

@Component({
  selector: 'app-card-mission-completed',
  templateUrl: './card-mission-completed.component.html',
  styleUrls: ['./card-mission-completed.component.scss'],
})
export class CardMissionCompletedComponent implements OnInit {
  @Input() mission: MissionData;
  @Input() route: string;

  constructor() { }

  ngOnInit() {}

}
