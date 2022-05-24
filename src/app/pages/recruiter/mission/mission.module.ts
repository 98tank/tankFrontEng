import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MissionPageRoutingModule } from './mission-routing.module';

import { MissionPage } from './mission.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { MyCandidateListComponent } from './components/my-candidate-list/my-candidate-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MissionPageRoutingModule
  ],
  declarations: [
    MissionPage,
    MyCandidateListComponent
  ]
})
export class MissionPageModule {}
