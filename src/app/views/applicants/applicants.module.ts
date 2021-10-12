import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { TagInputModule } from 'ngx-chips';

import { ApplicantsRoutingModule } from './applicants-routing.module';
import { ApplicantComponent } from './applicant/applicant.component';


@NgModule({
  declarations: [
    ApplicantComponent
  ],
  imports: [
    CommonModule,
    ApplicantsRoutingModule,
    FormsModule,
    TabsModule,
    TagInputModule,
    ReactiveFormsModule
  ]
})
export class ApplicantsModule { }
