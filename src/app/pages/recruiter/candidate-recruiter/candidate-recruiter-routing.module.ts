import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateRecruiterPage } from './candidate-recruiter.page';

const routes: Routes = [
  {
    path: '',
    component: CandidateRecruiterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateRecruiterPageRoutingModule {}
