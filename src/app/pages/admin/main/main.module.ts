import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';

import { MainPage } from './main.page';
import { StatisticsCardsComponent } from './components/statistics-cards/statistics-cards.component';

// Charts
import { ChartsModule } from 'ng2-charts';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartsModule,
    MainPageRoutingModule
  ],
  declarations: [
    MainPage,
    StatisticsCardsComponent]
})
export class MainPageModule {}
