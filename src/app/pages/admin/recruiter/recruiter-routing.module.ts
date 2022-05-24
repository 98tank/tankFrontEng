import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecruiterPage } from './recruiter.page';

const routes: Routes = [
  {
    path: '',
    component: RecruiterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecruiterPageRoutingModule {}
