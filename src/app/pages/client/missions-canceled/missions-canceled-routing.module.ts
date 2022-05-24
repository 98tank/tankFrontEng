import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MissionsCanceledPage } from './missions-canceled.page';

const routes: Routes = [
  {
    path: '',
    component: MissionsCanceledPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MissionsCanceledPageRoutingModule {}
