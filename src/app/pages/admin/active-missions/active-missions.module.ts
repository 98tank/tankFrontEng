import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActiveMissionsPageRoutingModule } from './active-missions-routing.module';

import { ActiveMissionsPage } from './active-missions.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    SharedModule,
    ActiveMissionsPageRoutingModule
  ],
  declarations: [ActiveMissionsPage]
})
export class ActiveMissionsPageModule {}
