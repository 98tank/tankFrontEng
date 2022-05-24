import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentHistoryReturnsPageRoutingModule } from './payment-history-returns-routing.module';

import { PaymentHistoryReturnsPage } from './payment-history-returns.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DataReturnComponent } from './components/data-return/data-return.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    SharedModule,
    PaymentHistoryReturnsPageRoutingModule
  ],
  declarations: [
    PaymentHistoryReturnsPage,
    DataReturnComponent
  ]
})
export class PaymentHistoryReturnsPageModule {}
