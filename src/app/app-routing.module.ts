import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'private',
    loadChildren: () =>
      import('./private/private.module').then((m) => m.PrivatePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'public/login',
    loadChildren: () =>
      import('./public/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'public/register',
    loadChildren: () =>
      import('./public/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: '',
    redirectTo: 'private',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
