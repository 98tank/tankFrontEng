import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentHistoryReturnsPage } from './payment-history-returns.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentHistoryReturnsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentHistoryReturnsPageRoutingModule {}
