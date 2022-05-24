import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllClientsPageRoutingModule } from './all-clients-routing.module';

import { AllClientsPage } from './all-clients.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MaterialModule,
    AllClientsPageRoutingModule
  ],
  declarations: [AllClientsPage]
})
export class AllClientsPageModule {}
