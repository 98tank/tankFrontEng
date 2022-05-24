import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentHistoryCompletePage } from './payment-history-complete.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentHistoryCompletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentHistoryCompletePageRoutingModule {}
