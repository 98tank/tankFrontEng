import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateInterface } from 'src/app/models';
import { SharedService } from 'src/app/services';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
})
export class DateComponent implements OnInit {
  @Input() title: string;
  days: Array<number> = [];
  years: Array<number> = [];
  months = [{s: 'Jan', n: 1}, {s: 'Feb', n: 2}, {s: 'Mar', n: 3}, {s: 'Apr', n: 4}, {s: 'May', n: 5}, {s: 'Jun', n: 6}, {s: 'Jul', n: 7}, {s: 'Aug', n: 8}, {s: 'Sep', n: 9}, {s: 'Oct', n: 10}, {s: 'Nov', n: 11}, {s: 'Dec', n: 12}];
  // months = [{s: 'Enero', n: 1}, {s: 'Febrero', n: 2}, 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  @Input() birthdate: DateInterface;
  @Output() date = new EventEmitter<any>();

  constructor(
    private ss: SharedService
  ) { }

  ngOnInit() {
    this.createDays();
    this.createYears();
   }

  createDays() {
    for (let i = 1; i < 32; i++ ) {
      this.days.push(i);
    }
  }

  createYears() {
    const currentYear = this.ss.getDate().getFullYear();
    for (let i = currentYear; i > 1949; i-- ) {
      this.years.push(i);
    }
  }

  buildDate(type: string, e) {
    const partialDate = { type, value: e.detail.value };
    this.date.emit(partialDate);
  }

}
