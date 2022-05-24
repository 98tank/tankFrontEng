import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecruiterPageRoutingModule } from './recruiter-routing.module';

import { RecruiterPage } from './recruiter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecruiterPageRoutingModule
  ],
  declarations: [RecruiterPage]
})
export class RecruiterPageModule {}
