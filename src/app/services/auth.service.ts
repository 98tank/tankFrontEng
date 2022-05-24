import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { ExternalApiService } from './external-api.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userUid: string;
  errorLogin = false;

  constructor(
    private fs: FirebaseService,
    private eas: ExternalApiService,
    private afAuth: AngularFireAuth) {
      this.validateUse();
     }

   // Metodo login usuario
   public loginEmail(email: string, pass: string) {
    this.errorLogin = false;
    return new Promise<any>(( resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, pass)
      .then( userData => resolve(userData),
      err => {
        reject(err);
        this.errorLogin = true;
      }).catch(err => {});
    });
  }

  // Metodo registro nuevo usuario
  userRegister(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.createUserWithEmailAndPassword(email, pass)
        .then(userData => resolve(userData),
          err => reject(err));
    });
  }

  async sendEmailVerification() {
    const dataUserFirebase = await this.afAuth.currentUser;
    return dataUserFirebase.sendEmailVerification();
  }

  // Metodo comprobar login
  public validateUse() {
    this.getAuth().subscribe( async auten => {
      if (auten) {
        this.userUid = auten.uid;
        this.newSession(this.userUid);
        this.eas.getStatistics(this.userUid);
      }
    });
  }

  newSession(uid: string){
    const date: number = new Date().getTime();
    this.fs.updateDoc(`users/${uid}`, { 'profile.lastSession': date });
  }

  // Metodo obtener userId
  getAuth() {
    return this.afAuth.authState.pipe(map( auten => auten)); }

  // Metodo para recuperar la contraseña
  // resetPassword(email: string) {
  //   return this.afAuth.sendPasswordResetEmail(email); }

  // Metodo cerrar sesion
  logout() {
    return this.afAuth.signOut().then(e => {
      this.userUid = null;
    });
  }
}
