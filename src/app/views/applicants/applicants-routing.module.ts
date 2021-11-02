import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicantComponent } from './applicant/applicant.component';
import { ApplicantDetailComponent } from './applicant-detail/applicant-detail.component';

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
      {
        path: ':id',
        component: ApplicantDetailComponent,
        data: {
          title: 'Applicant',
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
