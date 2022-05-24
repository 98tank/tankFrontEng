import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditMyAccountPageRoutingModule } from './edit-my-account-routing.module';

import { EditMyAccountPage } from './edit-my-account.page';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    EditMyAccountPageRoutingModule
  ],
  declarations: [EditMyAccountPage]
})
export class EditMyAccountPageModule {}
