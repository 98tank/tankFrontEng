import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwiperComponent } from 'swiper/angular';
// import Swiper core and required modules
import SwiperCore, { Autoplay, Pagination, Navigation, SwiperOptions } from 'swiper';

// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Navigation]);
@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LandingPage implements OnInit {
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
    private formBuild: FormBuilder
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

  getData() {
    console.log(this.form.value);
  }

  goUrl(url: string) {
    window.open(url, '_blank')
  }

}
