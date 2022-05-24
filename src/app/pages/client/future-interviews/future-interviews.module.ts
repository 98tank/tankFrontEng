import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FutureInterviewsPageRoutingModule } from './future-interviews-routing.module';

import { FutureInterviewsPage } from './future-interviews.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    FutureInterviewsPageRoutingModule
  ],
  declarations: [FutureInterviewsPage]
})
export class FutureInterviewsPageModule {}
