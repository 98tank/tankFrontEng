import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-reason-rejection',
  templateUrl: './reason-rejection.component.html',
  styleUrls: ['./reason-rejection.component.scss'],
})
export class ReasonRejectionComponent implements OnInit {
  @Input() reason: string;

  constructor() { }

  ngOnInit() {}

}
