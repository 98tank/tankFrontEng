import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllRecruitersPage } from './all-recruiters.page';

const routes: Routes = [
  {
    path: '',
    component: AllRecruitersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllRecruitersPageRoutingModule {}
