import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

interface UsersCard {
  admins: number;
  clients: number;
  recruiters: number;
}
@Component({
  selector: 'app-statistics-cards',
  templateUrl: './statistics-cards.component.html',
  styleUrls: ['./statistics-cards.component.scss'],
})
export class StatisticsCardsComponent implements OnInit {
  @Input() users: UsersCard;
  public barChartLegend = false;
  public barChartType: ChartType = 'horizontalBar';
  public barChartLabels: Label[] = ['Usuarios'];
  public barChartData: ChartDataSets[] = [
    { data: [6], label: 'Clientes', backgroundColor: ['#061347'], hoverBackgroundColor: ['#1f2b59'] },
    { data: [14], label: 'Reclutadores', backgroundColor: ['#ec5e04'], hoverBackgroundColor: ['#ee6e1d'] },
    { data: [5], label: 'Administradores', backgroundColor: ['#8dbdd8'], hoverBackgroundColor: ['#98c4dc'] },
  ];
  public barChartOptions: ChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{ ticks: {min: 0, stepSize: 15, beginAtZero: true}, gridLines: {display: false} }], yAxes: [{ ticks: {min: 0, stepSize: 15, beginAtZero: true}, gridLines: {display: false} }], ticks: {min: 0, stepSize: 20, beginAtZero: true} },
    // plugins: {
    //   datalabels: {
    //     anchor: 'end',
    //     align: 'end',
    //   }
    // }
  };
  constructor() { }

  ngOnInit() {
    this.barChartData[0].data = [this.users.clients];
    this.barChartData[1].data = [this.users.recruiters];
    this.barChartData[2].data = [this.users.admins];
  }

}
