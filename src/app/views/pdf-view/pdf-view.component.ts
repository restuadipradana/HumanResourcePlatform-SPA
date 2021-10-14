import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Observable, Subscription } from 'rxjs';
import { ApplicantService } from '../../core/_services/applicant.service';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.scss']
})
export class PdfViewComponent implements OnInit {


  id_applicant: string
  person: any={}

  constructor(private route: ActivatedRoute, private _applicantSvc: ApplicantService,) { }

  ngOnInit(): void {

    this.id_applicant = this.route.snapshot.params['id']
    this.getPerson(this.id_applicant)
  }

  getPerson(id: string) {
    this._applicantSvc.getPerson(id).subscribe(
      (res: any) => {
        this.person = {}
        this.person = res;

        console.log(this.person);
      },
      (error) => {
        console.log("Error: " , error.error.text);
      }
    );
  }

}
