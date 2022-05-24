import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-missions',
  templateUrl: './no-missions.component.html',
  styleUrls: ['./no-missions.component.scss'],
})
export class NoMissionsComponent implements OnInit {
  @Input() type: string;
  @Input() icon: string;

  constructor() { }

  ngOnInit() {}

}
