import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCandidatePageRoutingModule } from './create-candidate-routing.module';

import { CreateCandidatePage } from './create-candidate.page';
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
    CreateCandidatePageRoutingModule
  ],
  declarations: [CreateCandidatePage]
})
export class CreateCandidatePageModule {}
