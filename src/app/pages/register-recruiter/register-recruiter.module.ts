import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterRecruiterPageRoutingModule } from './register-recruiter-routing.module';

import { RegisterRecruiterPage } from './register-recruiter.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    RegisterRecruiterPageRoutingModule
  ],
  declarations: [RegisterRecruiterPage]
})
export class RegisterRecruiterPageModule {}
