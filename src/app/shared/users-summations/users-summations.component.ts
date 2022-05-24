import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-summations',
  templateUrl: './users-summations.component.html',
  styleUrls: ['./users-summations.component.scss'],
})
export class UsersSummationsComponent implements OnInit {
  @Input() text: string;
  @Input() qty: number;

  constructor() { }

  ngOnInit() {}

}
