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
  months = [{s: 'Enero', n: 1}, {s: 'Febrero', n: 2}, {s: 'Marzo', n: 3}, {s: 'Abril', n: 4}, {s: 'Mayo', n: 5}, {s: 'Junio', n: 6}, {s: 'Julio', n: 7}, {s: 'Agosto', n: 8}, {s: 'Septiembre', n: 9}, {s: 'Octubre', n: 10}, {s: 'Noviembre', n: 11}, {s: 'Diciembre', n: 12}];
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
