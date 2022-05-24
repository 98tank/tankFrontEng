import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MissionData, RequestRefound } from 'src/app/models';
import { FirebaseService, SharedService } from 'src/app/services';

@Component({
  selector: 'app-request-refund',
  templateUrl: './request-refund.component.html',
  styleUrls: ['./request-refund.component.scss'],
})
export class RequestRefundComponent implements OnInit {
  @Input() mission: MissionData;
  form: FormGroup;
  success = false;
  refound: RequestRefound;

  constructor(
    private ss: SharedService,
    private fs: FirebaseService,
    private modal: ModalController,
    private formBuild: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
   }

  private buildForm() {
    this.form = this.formBuild.group({
      reason: ['']
    });
  }

  closeModal() {
    if (this.refound) { this.modal.dismiss({ data: this.refound }); }
    else { this.modal.dismiss(); }
  }

  createData() {
    const date = this.ss.getDate().getTime();
    this.success = true;
    const id: string = this.fs.afs.createId();
    this.refound = {
      request_id: id,
      create_date: date,
      update_date: date,
      status: 'Pending',
      seen_by_admin: false,
      pay: this.mission.pay,
      uid_client: this.mission.uid,
      reason: this.form.value.reason,
      net_salary: this.mission.net_salary,
      mission_id: this.mission.mission_id,
      name_position: this.mission.name_position,
    };
  }

}
