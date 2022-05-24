import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentHistoryRewardsPageRoutingModule } from './payment-history-rewards-routing.module';

import { PaymentHistoryRewardsPage } from './payment-history-rewards.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataRewardComponent } from './components/data-reward/data-reward.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    SharedModule,
    PaymentHistoryRewardsPageRoutingModule
  ],
  declarations: [
    PaymentHistoryRewardsPage,
    DataRewardComponent
  ]
})
export class PaymentHistoryRewardsPageModule {}
