import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Profile } from 'src/app/models';
import { FirebaseService } from 'src/app/services';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-recruiters',
  templateUrl: './all-recruiters.page.html',
  styleUrls: ['./all-recruiters.page.scss'],
})
export class AllRecruitersPage {
  totalRecruiter: number;
  displayedColumns: string[] = [
    'Email',
    'Recruiters',
    'Register',
    'Last.Session',
    'Status',
  ];
  dataSource = new MatTableDataSource<Profile>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private fs: FirebaseService
  ) {}

  ionViewWillEnter() {
    this.getClients();
  }

  getClients() {
    const recruiter: Profile[] = [];
    this.fs.getColFilter('users', 'profile.type', '==', 'recruiter').get()
      .then(res => {
        this.totalRecruiter = res.size;
        if (res.size > 0) {
          let counter = 0;
          res.forEach(d => {
            ++counter;
            recruiter.push(d.data().profile as Profile);
            if (counter === res.size) {
              this.dataSource = new MatTableDataSource(recruiter);
              this.dataSource.sortingDataAccessor = (item, property) => item[this.changeSort(property)];
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          });
        }
      });
  }

  applyFilter(event: CustomEvent) {
    const filterValue = event.detail.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clickedRows(p: Profile) {
    this.router.navigate(['/admin/reclutador/', p.uid]);
  }

  changeSort(expresion: string): string {
    switch (expresion) {
      case 'Email':
        return 'email';
      case 'Recruiters':
        return 'name';
      case 'Register':
        return 'registerDate';
      case 'Last.Session':
        return 'lastSession';
      case 'Status':
        return 'status';
      default:
        return;
    }
  }

}
