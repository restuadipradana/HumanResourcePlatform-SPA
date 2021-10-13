import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { TagInputModule } from 'ngx-chips';
import { DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { IconModule } from '@coreui/icons-angular';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

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
    DataTablesModule,
    TagInputModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    IconModule,
    TooltipModule.forRoot()
  ]
})
export class ApplicantsModule { }
