import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidatePageRoutingModule } from './candidate-routing.module';

import { CandidatePage } from './candidate.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecruiterDataComponent } from './components/recruiter-data/recruiter-data.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CandidatePageRoutingModule
  ],
  declarations: [
    CandidatePage,
    RecruiterDataComponent
  ]
})
export class CandidatePageModule {}
