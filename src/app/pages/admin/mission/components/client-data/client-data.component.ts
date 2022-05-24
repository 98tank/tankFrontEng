import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from 'src/app/models';
import { FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-client-data',
  templateUrl: './client-data.component.html',
  styleUrls: ['./client-data.component.scss'],
})
export class ClientDataComponent implements OnInit {
  @Input() uid: string;
  client$: Observable<User>;

  constructor(
    private fs: FirebaseService
  ) { }

  ngOnInit() {
    this.getClient();
  }

  getClient() {
    this.client$ = this.fs.getDocObserver(`users/${this.uid}`);
  }

}
