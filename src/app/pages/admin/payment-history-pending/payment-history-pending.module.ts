import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentHistoryPendingPageRoutingModule } from './payment-history-pending-routing.module';

import { PaymentHistoryPendingPage } from './payment-history-pending.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    PaymentHistoryPendingPageRoutingModule
  ],
  declarations: [PaymentHistoryPendingPage]
})
export class PaymentHistoryPendingPageModule {}
