import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MissionPageRoutingModule } from './mission-routing.module';

import { MissionPage } from './mission.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClientDataComponent } from './components/client-data/client-data.component';
import { ContactForServiceComponent } from './components/contact-for-service/contact-for-service.component';

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
    ClientDataComponent,
    ContactForServiceComponent
  ]
})
export class MissionPageModule {}
