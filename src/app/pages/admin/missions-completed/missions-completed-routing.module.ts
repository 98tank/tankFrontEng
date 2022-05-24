import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MissionsCompletedPage } from './missions-completed.page';

const routes: Routes = [
  {
    path: '',
    component: MissionsCompletedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MissionsCompletedPageRoutingModule {}
