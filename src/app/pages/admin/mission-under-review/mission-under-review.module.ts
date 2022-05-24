import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MissionUnderReviewPageRoutingModule } from './mission-under-review-routing.module';

import { MissionUnderReviewPage } from './mission-under-review.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MissionUnderReviewPageRoutingModule
  ],
  declarations: [MissionUnderReviewPage]
})
export class MissionUnderReviewPageModule {}
