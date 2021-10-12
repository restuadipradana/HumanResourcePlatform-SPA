import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicantComponent } from './applicant/applicant.component';

const routes: Routes = [
  {
    path: '',
    // data: {
    //   title: 'Kanban'
    // },
    children: [
      {
        path: '',
        component: ApplicantComponent,
        data: {
          title: 'Applicants'
        }
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicantsRoutingModule { }
