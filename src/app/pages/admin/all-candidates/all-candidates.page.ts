import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CandidateData, MissionData } from 'src/app/models';
import { FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-all-candidates',
  templateUrl: './all-candidates.page.html',
  styleUrls: ['./all-candidates.page.scss'],
})
export class AllCandidatesPage implements AfterViewInit {

  displayedColumns = [
    'Email',
    'Name',
    'Position',
    'Joined-on',
    'Status',
  ];
  totalCandidates: number;
  candidates: CandidateData[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<CandidateData>();

  constructor(
    private router: Router,
    private fs: FirebaseService
  ) {}

  ionViewWillEnter() {
    this.getClients();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getClients() {
    const can = [];
    let counter = 0;
    this.fs.getColOrder('candidates').where('block', '==', false).get().then(res => {
      if (res.size > 0) {
        res.forEach(d => {
          const size = res.size;
          let c: CandidateData = d.data() as CandidateData;
          this.fs.afs.doc(`missions/${c.mission_id}`).get().subscribe(df => {
            ++counter;
            const data: MissionData = df.data() as MissionData;
            c = {
              ...c,
              name_position: data.name_position
            };
            can.push(c);
            if (counter === size) {
              this.candidates = can;
              this.totalCandidates = this.candidates.length;
              this.dataSource = new MatTableDataSource(this.candidates);
              this.dataSource.sortingDataAccessor = (item, property) => item[this.changeSort(property)];
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          });
        });
      } else {
        this.candidates = [];
      }
    });
  }
  applyFilter(event: CustomEvent) {
    const filterValue = event.detail.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clickedRows(c: CandidateData) {
    this.router.navigate(['/admin/candidato/', c.candidate_id]);
  }

  changeSort(expresion: string): string {
    switch (expresion) {
      case 'Email':
        return 'email';
      case 'Name':
        return 'name';
      case 'Position':
        return 'name_position';
      case 'Joined-on':
        return 'create_date';
      case 'Status':
        return 'status';
      default:
        return;
    }
  }

}
