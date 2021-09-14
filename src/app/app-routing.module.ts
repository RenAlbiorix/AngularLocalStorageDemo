import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './common/Guard/auth.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  }, 
  {
    path: 'login',
    component:LoginComponent
  },
  {
    path: 'detailPage',
    loadChildren:  () => import('././crud-detail/crud-detail.module').then(m => m.CrudDetailModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dynamic',
    loadChildren:  () => import('././dynamic-form/dynamic-form.module').then(m => m.DynamicFormModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'calender',
    loadChildren:  () => import('././calender/calender.module').then(m => m.CalenderModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
