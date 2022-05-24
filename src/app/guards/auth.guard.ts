import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(
    public router: Router,
    public afAuth: AngularFireAuth) {  }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean  {
    return this.afAuth.authState
      .pipe(take(1))
      .pipe(map(authState => !!authState))
      .pipe(tap(authenticated => {
        if (!authenticated) {
          this.router.navigate(['/login']);
        }
      }));
    }
}
