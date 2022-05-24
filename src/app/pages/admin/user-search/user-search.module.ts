import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserSearchPageRoutingModule } from './user-search-routing.module';

import { UserSearchPage } from './user-search.page';
import { InfoUserComponent } from './components/info-user/info-user.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserSearchPageRoutingModule
  ],
  declarations: [
    UserSearchPage,
    InfoUserComponent
  ]
})
export class UserSearchPageModule {}
