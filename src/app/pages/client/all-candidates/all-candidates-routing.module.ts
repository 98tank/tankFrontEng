import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllCandidatesPage } from './all-candidates.page';

const routes: Routes = [
  {
    path: '',
    component: AllCandidatesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllCandidatesPageRoutingModule {}
