import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  positions = ['SAP Funcional', 'Desarrollador Java Sr', 'Desarrollador Saleforce', 'Gerente Omnicanal', 'UX/UI Designer', 'Guidewire Developer', 'Brand Manager', 'On Trade', 'Ciberseguridad', 'Saleforce Architect', 'ABAP HANA', 'Product Owner']
  form: FormGroup;
  year = new Date().getFullYear();

  constructor(
    private formBuild: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
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
