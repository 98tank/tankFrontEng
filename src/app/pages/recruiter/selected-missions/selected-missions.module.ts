import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectedMissionsPageRoutingModule } from './selected-missions-routing.module';

import { SelectedMissionsPage } from './selected-missions.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    SharedModule,
    SelectedMissionsPageRoutingModule
  ],
  declarations: [SelectedMissionsPage]
})
export class SelectedMissionsPageModule {}
