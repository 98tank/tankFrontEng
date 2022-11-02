import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwiperComponent } from 'swiper/angular';
// import Swiper core and required modules
import SwiperCore, { Autoplay, Pagination, Navigation, SwiperOptions } from 'swiper';
import { LandingContact } from 'src/app/models';
import { ExternalApiService } from 'src/app/services';
import { AlertController, LoadingController } from '@ionic/angular';
import { crytoData } from 'src/app/helper/crypto-js';

// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Navigation]);
@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LandingPage implements OnInit {
  send = false;
  positions = ['SAP Funcional', 'Desarrollador Java Sr', 'Desarrollador Saleforce', 'Gerente Omnicanal', 'UX/UI Designer', 'Guidewire Developer', 'Brand Manager', 'On Trade', 'Ciberseguridad', 'Saleforce Architect', 'ABAP HANA', 'Product Owner']
  logos = ['Grupo-Elektra.png', 'att.png', 'banco-azteca.png', 'frethunters-01.png', 'grupo-salinas.png', 'home-depot.png', 'italika.png', 'Logo-Soft.png', 'santander.png', 'smart.png', 'tvazteca.png', 'securitas.png'];
  capturas = ['cap-01.png', 'cap-02.png', 'cap-03.png', 'cap-04.png'];
  form: FormGroup;
  year = new Date().getFullYear();
  @ViewChild('swiper') swiper: SwiperComponent;
  config: SwiperOptions = {
    pagination: {
      clickable: true,
      type: 'bullets',
    },
    loop: true,
    lazy: {
      loadPrevNext: false
    },
  };
  animationInProgress = false;

  constructor(
    private eas: ExternalApiService,
    private formBuild: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.buildForm();
    this.startAnimation();
  }

  startAnimation() {
    if(this.animationInProgress) return;
    this.animationInProgress = true;
    setTimeout(() => {
      this.swiper.swiperRef.slideNext(2000);
      this.animationInProgress = false;
      this.startAnimation();
    }, 5000);
  }

  next() {
    this.swiper.swiperRef.slideNext(1000);
  }

  private buildForm() {
    this.form = this.formBuild.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      comments: ['', [Validators.required]],
    })
  }

  async getData() {
    if (this.form.valid) {
      const data: LandingContact = this.form.value as LandingContact;
      try {
        await this.presentLoading('Enviando...');
        const hash: string = await crytoData(data);
        await this.eas.sendEmailLanding(hash);
        await this.loadingController.dismiss();
        this.form.reset();
        this.send = true;
        this.updateSuccess();
      } catch (error) {
        await this.loadingController.dismiss();
        this.alertError();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  goUrl(url: string) {
    window.open(url, '_blank')
  }


  async alertError() {
    const alert = await this.alertController.create({
      header: 'Error',
      mode: 'ios',
      cssClass: 'delete-alert',
      message: `<ion-icon class="red" name="close-circle"></ion-icon> There was an error sending the email, please check your data and try again.`,
      buttons: ['Ok']
    });
    await alert.present();
  }

  async updateSuccess() {
    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      header: 'Send',
      mode: 'ios',
      message: '<ion-icon class="green" name="checkmark-circle"></ion-icon> Message sent successfully, we will contact you shortly.',
      buttons: ['Ok']
    });
    await alert.present();
  }

  async presentLoading(message: string) {
    const loading = await this.loadingController.create({ message });
    await loading.present();
  }

}
