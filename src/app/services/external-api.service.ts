import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExternalApiService {

  constructor(
    private http: HttpClient) {
   }

  sendEmail(uid: string, message: string, url: string, subject: string) {
    return new Promise((resolve, reject) => {
      const params = { uid, message, url, subject };
      const api = environment.api;
      const endPoint = `${api}/notification/mail`;
      this.http.post(endPoint, params).subscribe({
        next: (res) => resolve(res),
        error: (error) => resolve(error),
      });
    });
  }

  sendEmailAdmins(message: string, url: string, subject: string) {
    return new Promise((resolve, reject) => {
      const params = { message, url, subject };
      const api = environment.api;
      const endPoint = `${api}/notification/admin`;
      this.http.post(endPoint, params).subscribe({
        next: (res) => resolve(res),
        error: (error) => resolve(error),
      });
    });
  }

  sendEmailWelcome(email: string, uid: string) {
    return new Promise((resolve, reject) => {
      const params = { email, uid };
      const api = environment.api;
      const endPoint = `${api}/notification/welcome`;
      this.http.post(endPoint, params).subscribe({
        next: (res) => resolve(res),
        error: (error) => resolve(error),
      });
    });
  }

  sendEmailReferral(email: string, name: string, message: string, url: string, subject: string) {
    return new Promise((resolve, reject) => {
      const params = { email, name, message, url: `${window.location.origin}/${url}`, subject };
      const api = environment.api;
      const endPoint = `${api}/notification/referral`;
      this.http.post(endPoint, params).subscribe({
        next: (res) => resolve(res),
        error: (error) => resolve(error),
      });
    });
  }

  sendEmailNotification(email: string, field: string) {
    return new Promise((resolve, reject) => {
      const params = { email };
      const api = environment.api;
      const endPoint = `${api}/notification/${field}`;
      this.http.post(endPoint, params).subscribe({
        next: (res) => resolve(res),
        error: (error) => resolve(error),
      });
    });
  }

  getStatistics(uid: string) {
    return new Promise((resolve, reject) => {
      const api = environment.api;
      const endPoint = `${api}/statistic/notification/${uid}`;
      this.http.get(endPoint).subscribe({
        next: (res) => resolve(res),
        error: (error) => resolve(error),
      });
    });
  }

  deleteUser(uid: string, type: string) {
    return new Promise((resolve, reject) => {
      const body = { uid, type };
      const api = environment.api;
      const endPoint = `${api}/users/delete`;
      this.http.delete(endPoint, {body}).subscribe({
        next: (res) => resolve(res),
        error: (error) => resolve(false),
      });
    });
  }
}
