import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-change-of-view',
  templateUrl: './change-of-view.component.html',
  styleUrls: ['./change-of-view.component.scss'],
})
export class ChangeOfViewComponent implements OnInit {
  @Input() view: string;
  @Output() newView = new EventEmitter<string>();

  constructor() { }

  ngOnInit() { }

  changeView(view: string) {
    this.newView.emit(view);
  }

}
