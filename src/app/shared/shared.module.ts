import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './layout/header/header.component';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderComponent,
    RouterModule
  ]
})
export class SharedModule { }
