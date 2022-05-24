import { Component, OnDestroy, OnInit } from '@angular/core';

import { ModalController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SharedService, FirebaseService, AuthService } from './services';
import { User } from './models';
import { PdfViewComponent } from './shared/pdf-view/pdf-view.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  noMenu: boolean;
  public appPages;
  user: User;
  public selectedIndex = 0;
  year = new Date().getFullYear();
  public labels = ['Family', 'Friends', 'Notes'];
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  subscription3: Subscription = new Subscription();

  constructor(
    private router: Router,
    private ss: SharedService,
    private auth: AuthService,
    private platform: Platform,
    public fs: FirebaseService,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private modalController: ModalController
  ) {
    this.initializeApp();
    const navEndEvents$ = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
    );
    navEndEvents$.subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects === '/login' || event.urlAfterRedirects === '/registro-cliente' || event.urlAfterRedirects === '/registro-reclutador' || event.urlAfterRedirects === '/registro-admin') {
        this.noMenu = true;
      } else {
        this.noMenu = false;
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.getMenuUser();
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
  }

  update() {
    window.location.reload();
  }

  getMenuUser() {
    this.subscription1 = this.auth.getAuth().subscribe(user => {
      if (user?.uid) {
        this.subscription2 = this.fs.getDocObserver(`users/${user.uid}`).subscribe( (u: User) => {
          if (u) {
            this.user = u;
            this.subscription3 = this.ss.getDataJsonLocal(this.user.profile.type).subscribe(m => {
              this.appPages = m;
              const path = window.location.pathname;
              if (path !== undefined) {
                this.selectedIndex = this.appPages.findIndex(page => page.redirecTo.toLowerCase() === path.toLowerCase());
              }
            });
          } else {
            this.user = null;
            this.router.navigate(['login']);
          }
        });
      } else {
        this.appPages = [];
        this.user = null;
      }
    });
  }

  openLegal(type: string) {
    if (type === 'politics') { this.openPDF('POLITICA-DE-PRIVACIDAD-98-TANK-VF'); }
    if (type === 'term' && this.user.profile.type === 'recruiter') { this.openPDF('TERMINOS-Y-CONDICIONES-RECLUTADORES-98-TANK-VF'); }
    if (type === 'term' && this.user.profile.type === 'client') { this.openPDF('TERMINOS-Y-CONDICIONES-CLIENTES-VF'); }
  }

  async openPDF(file: string) {
    const modal = await this.modalController.create({
      component: PdfViewComponent,
      componentProps: {file}
    });
    return await modal.present();
  }

}
