import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MissionsCanceledPageRoutingModule } from './missions-canceled-routing.module';

import { MissionsCanceledPage } from './missions-canceled.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    SharedModule,
    MissionsCanceledPageRoutingModule
  ],
  declarations: [MissionsCanceledPage]
})
export class MissionsCanceledPageModule {}
