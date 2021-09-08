import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormRoutingModule } from './dynamic-form-routing.module';
import { ListPageComponent } from './list-page/list-page.component';


@NgModule({
  declarations: [
    ListPageComponent
  ],
  imports: [
    CommonModule,
    DynamicFormRoutingModule
  ]
})
export class DynamicFormModule { }
