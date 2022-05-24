import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentHistoryPendingPage } from './payment-history-pending.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentHistoryPendingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentHistoryPendingPageRoutingModule {}
