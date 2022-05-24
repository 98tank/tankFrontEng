import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentHistoryCompletePageRoutingModule } from './payment-history-complete-routing.module';

import { PaymentHistoryCompletePage } from './payment-history-complete.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    SharedModule,
    PaymentHistoryCompletePageRoutingModule
  ],
  declarations: [PaymentHistoryCompletePage]
})
export class PaymentHistoryCompletePageModule {}
