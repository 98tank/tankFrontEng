import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './filter.pipe';
import { OrderByPipe } from './order-by.pipe';
import { NestedOrderPipe } from './nested-order.pipe';



@NgModule({
  declarations: [
    FilterPipe,
    OrderByPipe,
    NestedOrderPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FilterPipe,
    OrderByPipe,
    NestedOrderPipe,
   ]
})
export class PipesModule { }
