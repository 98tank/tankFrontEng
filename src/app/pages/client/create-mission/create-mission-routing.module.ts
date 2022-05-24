import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateMissionPage } from './create-mission.page';

const routes: Routes = [
  {
    path: '',
    component: CreateMissionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateMissionPageRoutingModule {}
