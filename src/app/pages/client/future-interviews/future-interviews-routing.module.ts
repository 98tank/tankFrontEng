import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FutureInterviewsPage } from './future-interviews.page';

const routes: Routes = [
  {
    path: '',
    component: FutureInterviewsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FutureInterviewsPageRoutingModule {}
