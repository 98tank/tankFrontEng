import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MissionsCanceledPageRoutingModule } from './missions-canceled-routing.module';

import { MissionsCanceledPage } from './missions-canceled.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    MissionsCanceledPageRoutingModule
  ],
  declarations: [
    MissionsCanceledPage,
  ]
})
export class MissionsCanceledPageModule {}
