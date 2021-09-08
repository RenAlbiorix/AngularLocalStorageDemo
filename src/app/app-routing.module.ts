import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'detailPage'
  }, 
  {
    path: 'detailPage',
    loadChildren:  () => import('././crud-detail/crud-detail.module').then(m => m.CrudDetailModule)
  },
  {
    path: 'dynamic',
    loadChildren:  () => import('././dynamic-form/dynamic-form.module').then(m => m.DynamicFormModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
