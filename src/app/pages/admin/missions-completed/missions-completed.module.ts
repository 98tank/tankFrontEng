import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MissionsCompletedPageRoutingModule } from './missions-completed-routing.module';

import { MissionsCompletedPage } from './missions-completed.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MissionsCompletedPageRoutingModule
  ],
  declarations: [MissionsCompletedPage]
})
export class MissionsCompletedPageModule {}
