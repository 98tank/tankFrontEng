import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterRecruiterPage } from './register-recruiter.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterRecruiterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterRecruiterPageRoutingModule {}
