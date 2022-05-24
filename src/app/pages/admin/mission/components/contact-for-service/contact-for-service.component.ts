import { Component, Input, OnInit } from '@angular/core';
import { MissionData } from 'src/app/models';
import { FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-contact-for-service',
  templateUrl: './contact-for-service.component.html',
  styleUrls: ['./contact-for-service.component.scss'],
})
export class ContactForServiceComponent implements OnInit {
  @Input() m: MissionData;
  contacted: string;
  check: boolean;

  constructor(
    private fs: FirebaseService
  ) { }

  ngOnInit() {
    this.statusPayment();
  }

  statusPayment(){
    this.contacted = this.m.type_contract.contacted || 'No';
    if (this.contacted === 'Si') {
      this.check = true;
    } else {
      this.check = false;
    }
  }

  changePayment(e) {
    e.detail.checked ? this.contacted = 'Si' : this.contacted = 'No';
    this.fs.updateDoc(`missions/${this.m.mission_id}`, { 'type_contract.contacted': this.contacted });
  }

}
