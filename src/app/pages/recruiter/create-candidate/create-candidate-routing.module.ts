import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateCandidatePage } from './create-candidate.page';

const routes: Routes = [
  {
    path: '',
    component: CreateCandidatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateCandidatePageRoutingModule {}
