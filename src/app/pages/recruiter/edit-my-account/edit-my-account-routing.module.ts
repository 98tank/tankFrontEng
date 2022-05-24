import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditMyAccountPage } from './edit-my-account.page';

const routes: Routes = [
  {
    path: '',
    component: EditMyAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditMyAccountPageRoutingModule {}
