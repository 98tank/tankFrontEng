import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentHistoryRewardsPage } from './payment-history-rewards.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentHistoryRewardsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentHistoryRewardsPageRoutingModule {}
