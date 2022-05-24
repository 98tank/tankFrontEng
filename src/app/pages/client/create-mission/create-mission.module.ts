import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateMissionPageRoutingModule } from './create-mission-routing.module';

import { CreateMissionPage } from './create-mission.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    CreateMissionPageRoutingModule
  ],
  declarations: [CreateMissionPage]
})
export class CreateMissionPageModule {}
