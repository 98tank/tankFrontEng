import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { take } from 'rxjs/operators';
import { User } from '../models';
import { FirebaseService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanLoad {
  constructor(
    private router: Router,
    private fs: FirebaseService,
    private afAuth: AngularFireAuth
  ) {}

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise<boolean>((resolve, reject) => {
      this.afAuth.authState.pipe(take(1)).subscribe((authState) => {
        if (authState?.uid) {
          this.fs.afs.firestore
            .doc(`users/${authState.uid}`)
            .get()
            .then((u) => {
              const user: User = u.data() as User;
              if ((user.profile.type === 'admin') || (user.profile.type === 'superAdmin')) { resolve(true); }
              else { this.router.navigate(['/login']); }
            });
        }
      });
    });
  }
}
