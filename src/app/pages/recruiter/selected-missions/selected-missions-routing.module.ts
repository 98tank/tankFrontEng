import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectedMissionsPage } from './selected-missions.page';

const routes: Routes = [
  {
    path: '',
    component: SelectedMissionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectedMissionsPageRoutingModule {}
