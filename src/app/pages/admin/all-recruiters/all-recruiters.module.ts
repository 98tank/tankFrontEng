import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllRecruitersPageRoutingModule } from './all-recruiters-routing.module';

import { AllRecruitersPage } from './all-recruiters.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MaterialModule,
    AllRecruitersPageRoutingModule
  ],
  declarations: [AllRecruitersPage]
})
export class AllRecruitersPageModule {}
