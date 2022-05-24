import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    private http: HttpClient,
  ) { }

  getDataJsonLocal(type: string, route?: string): Observable<any> {
    if (type === 'client') {
      return this.http.get('assets/data/client-menu.json');
    }
    else if (type === 'recruiter') {
      return this.http.get('assets/data/recruiter-menu.json');
    }
    else if (type === 'admin' || type === 'superAdmin') {
      return this.http.get('assets/data/admin-menu.json');
    }
    if (route) {
      return this.http.get(route);
    }
  }

  getDate() {
    return new Date();
  }

  reload() {
    window.location.reload();
  }

  getAge(date: string) {
    const today = this.getDate();
    const birthDate = new Date(date.replace(/-/g, '\/').replace(/T.+/, ''));
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) { age--; }
    return age;
  }

}
