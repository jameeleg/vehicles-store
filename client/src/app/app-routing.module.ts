import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent} from './logout/logout.component';


import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {path: '',   redirectTo: 'home', pathMatch: 'full' },
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {path: 'logout', component: LogoutComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
