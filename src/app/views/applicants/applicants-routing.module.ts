import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicantComponent } from './applicant/applicant.component';
import { ApplicantDetailComponent } from './applicant-detail/applicant-detail.component';
import { UploadComponent } from './upload/upload.component';

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
        path: 'detail/:id',
        component: ApplicantDetailComponent,
        data: {
          title: 'Applicant',
        }
      },
      {
        path: 'upload',
        component: UploadComponent,
        data: {
          title: 'Upload Applicant',
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
