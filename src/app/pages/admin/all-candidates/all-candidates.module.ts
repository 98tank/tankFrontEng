import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllCandidatesPageRoutingModule } from './all-candidates-routing.module';

import { AllCandidatesPage } from './all-candidates.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    PipesModule,
    MaterialModule,
    AllCandidatesPageRoutingModule
  ],
  declarations: [AllCandidatesPage]
})
export class AllCandidatesPageModule {}
