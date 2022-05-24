import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MissionUnderReviewPage } from './mission-under-review.page';

const routes: Routes = [
  {
    path: '',
    component: MissionUnderReviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MissionUnderReviewPageRoutingModule {}
