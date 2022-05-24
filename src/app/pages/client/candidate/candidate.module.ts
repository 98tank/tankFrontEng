import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidatePageRoutingModule } from './candidate-routing.module';

import { CandidatePage } from './candidate.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { MultipleButtonsComponent } from './components/multiple-buttons/multiple-buttons.component';
import { CreateInterviewComponent } from './components/create-interview/create-interview.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    CandidatePageRoutingModule
  ],
  declarations: [
    CandidatePage,
    MultipleButtonsComponent,
    CreateInterviewComponent
  ]
})
export class CandidatePageModule {}
