import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { SharedService } from 'src/app/services';

@Component({
  selector: 'app-create-interview',
  templateUrl: './create-interview.component.html',
  styleUrls: ['./create-interview.component.scss'],
})
export class CreateInterviewComponent implements OnInit {
  @Input() candidateId: string;
  form: UntypedFormGroup;
  success = false;
  address: string;
  date: string = null;
  medioType: string;

  constructor(
    private ss: SharedService,
    private formBuild: UntypedFormBuilder,
    private modal: ModalController,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.buildDates();
   }

  closeModal() {
    this.modal.dismiss();
  }

  private buildForm() {
    this.form = this.formBuild.group({
      date_option1: ['', Validators.required],
      date_option2: ['', Validators.required],
      channel: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  getData() {
    if (this.form.valid) {
      this.success = true;
    } else {
      this.form.markAllAsTouched();
    }
  }

  selectMedio(event) {
    const value = event.detail.value;
    this.address = value;
  }

  buildDates() {
    let day = `${this.ss.getDate().getDate()}`;
    let month = `${this.ss.getDate().getMonth() + 1}`;
    const year = `${this.ss.getDate().getFullYear()}`;
    if (this.ss.getDate().getDate() < 10) {
      day = `0${this.ss.getDate().getDate()}`;
    }
    if (this.ss.getDate().getMonth() + 1 < 10) {
      month = `0${this.ss.getDate().getMonth() + 1}`;
    }
    this.date = `${year}-${month}-${day}`;
  }

  emitData() {
    const interview = {
      channel: this.form.value.channel,
      address: this.form.value.address,
      date_option1: new Date(this.form.value.date_option1).toISOString(),
      date_option2: new Date(this.form.value.date_option2).toISOString()
    };
    this.modal.dismiss({ interview });
  }

}
