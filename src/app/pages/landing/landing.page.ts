import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  positions = ['SAP Funcional', 'Desarrollador Java Sr', 'Desarrollador Saleforce', 'Gerente Omnicanal', 'UX/UI Designer', 'Guidewire Developer', 'Brand Manager', 'On Trade', 'Ciberseguridad', 'Saleforce Architect', 'ABAP HANA', 'Product Owner']

  constructor() { }

  ngOnInit() {
  }

}
