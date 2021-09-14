import { NgModule } from '@angular/core';
import { CalenderRoutingModule } from './calender-routing.module';
import { CalenderComponent } from './calender/calender.component';
import { CalenderPopupComponent } from './calender-popup/calender-popup.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    CalenderComponent,
    CalenderPopupComponent
  ],
  imports: [
    SharedModule,
    CalenderRoutingModule
  ]
})
export class CalenderModule { }
