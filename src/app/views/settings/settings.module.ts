import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';

import { SettingsRoutingModule } from './settings-routing.module';
import { UserAuthorizationComponent } from './user-authorization/user-authorization.component';


@NgModule({
  declarations: [
    UserAuthorizationComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ModalModule.forRoot()
  ]
})
export class SettingsModule { }
