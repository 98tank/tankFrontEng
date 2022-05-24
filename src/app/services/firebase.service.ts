import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Commissions, WhereFilterOp } from '../models';
import { deleteField } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  commission$: Observable<Commissions>;

  currentVersion = '2.0.1';
  lastVersion: string;

  constructor(
    public afs: AngularFirestore) {
    this.getVersion();
    this.getCommissions();
  }

  getVersion() {
    this.getDocObserver(`utilities/versions`).pipe(pluck('last')).subscribe((v: string) => this.lastVersion = v);
  }

  getColObserver(route: string) {
    return this.afs.collection<any>(route).valueChanges();
  }

  getCol(route: string) {
    return this.afs.firestore.collection(route).get();
  }

  getCollectionWithOrder(route: string) {
    return this.afs.firestore.collection(route);
  }

  getDocObserver(route: string) {
    return this.afs.doc<any>(route).valueChanges();
  }

  getDoc(route: string): Promise<any> {
    return this.afs.firestore.doc(route).get();
  }

  getColFilter(route: string, p1: any, action: WhereFilterOp, p2: any) {
    return this.afs.firestore.collection(route).where(p1, action, p2);
  }
  getColOrder(route: string) {
    return this.afs.firestore.collection(route);
  }

  setDoc(route: string, doc: any) {
    return this.afs.doc(route).set(doc);
  }

  addDoc(route: string, doc: any) {
    return this.afs.collection(route).add(doc);
  }

  deleteDoc(route: string) {
    return this.afs.doc(route).delete();
  }

  deleteField(route: string, field: string) {
    return this.afs.doc(route).update({[field]: deleteField()});
  }

  updateDoc(route: string, doc: any) {
    return this.afs.doc(route).update(doc);
  }

  getCommissions() {
    this.commission$ = this.afs.doc<Commissions>('utilities/commissions').valueChanges();
  }

}
