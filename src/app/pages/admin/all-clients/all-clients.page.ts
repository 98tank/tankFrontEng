import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Profile } from 'src/app/models';
import { FirebaseService } from 'src/app/services';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-clients',
  templateUrl: './all-clients.page.html',
  styleUrls: ['./all-clients.page.scss'],
})
export class AllClientsPage implements AfterViewInit {
  clients: Profile[];
  totalClients: number;
  displayedColumns = [
    'Email',
    'Cliente',
    'Regístro',
    'Ult.Sesión',
    'Estatus',
  ];
  dataSource = new MatTableDataSource<Profile>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private fs: FirebaseService,
  ) { }

  ionViewWillEnter() {
    this.getClients();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getClients() {
    this.clients = [];
    this.fs.getColFilter('users', 'profile.type', '==', 'client').get()
      .then(res => {
        this.totalClients = res.size;
        if (res.size > 0) {
          let counter = 0;
          res.forEach(d => {
            ++counter;
            this.clients.push(d.data().profile as Profile);
            if (counter === res.size) {
              this.dataSource = new MatTableDataSource(this.clients);
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
    this.router.navigate(['/admin/clientes/', p.uid]);
  }

  changeSort(expresion: string): string {
    switch (expresion) {
      case 'Email':
        return 'email';
      case 'Cliente':
        return 'name_contact';
      case 'Regístro':
        return 'registerDate';
      case 'Ult.Sesión':
        return 'lastSession';
      case 'Estatus':
        return 'status';
      default:
        return;
    }
  }

}
