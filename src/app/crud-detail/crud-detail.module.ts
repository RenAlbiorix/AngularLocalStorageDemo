import { NgModule } from '@angular/core';
import { CrudDetailRoutingModule } from './crud-detail-routing.module';
import { DetailFormComponent } from './detail-form/detail-form.component';
import { SharedModule } from '../shared/shared.module';
import { DetailPageComponent } from './detail-page/detail-page.component';


@NgModule({
  declarations: [
    DetailFormComponent,
    DetailPageComponent
  ],
  imports: [
    CrudDetailRoutingModule,
    SharedModule
  ]
})
export class CrudDetailModule { }
