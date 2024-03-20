import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { PagesComponent } from './components/pages/pages.component';
import { UserComponent } from './components/pages/user/user.component';
import { AdminComponent } from './components/pages/admin/admin.component';
import { LoginGuard } from './_guards/login.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login'
    }
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: {
      title: 'Sign Up'
    }
  },
  {
    path: 'page',
    component: PagesComponent,
    canActivate: [LoginGuard],
    canLoad: [LoginGuard],
    children: [
      {
        path: 'user',
        component: UserComponent,
        data: {
          title: 'User Page'
        }
      },
      {
        path: 'admin',
        component: AdminComponent,
        data: {
          title: 'Admin Page'
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
