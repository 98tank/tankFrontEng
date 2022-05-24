import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateRecruiterPageRoutingModule } from './candidate-recruiter-routing.module';

import { CandidateRecruiterPage } from './candidate-recruiter.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CandidateRecruiterPageRoutingModule
  ],
  declarations: [CandidateRecruiterPage]
})
export class CandidateRecruiterPageModule {}
