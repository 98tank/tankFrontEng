import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllCandidatesPageRoutingModule } from './all-candidates-routing.module';

import { AllCandidatesPage } from './all-candidates.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllCandidatesPageRoutingModule
  ],
  declarations: [AllCandidatesPage]
})
export class AllCandidatesPageModule {}
