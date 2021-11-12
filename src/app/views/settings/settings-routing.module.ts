import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAuthorizationComponent } from './user-authorization/user-authorization.component';

const routes: Routes = [
  {
    path: '',
    // data: {
    //   title: 'Kanban'
    // },
    children: [
      {
        path: 'users',
        component: UserAuthorizationComponent,
        data: {
          title: 'User Authorization'
        }
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
