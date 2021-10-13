import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

import { ApplicantService } from '../../../core/_services/applicant.service';
import { HApplicantSearch } from '../../../core/_models/h-applicant-search';
import { TApplicant } from '../../../core/_models/t-applicant';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.scss']
})
export class ApplicantComponent implements OnInit, OnDestroy, AfterViewInit {


  searchModel: any = {}
  applicantList: TApplicant[] = []
  srcChip = []
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  //dtTrigger: Subject = new Subject();

  constructor(private toastr: ToastrService, private _applicantSvc: ApplicantService) { }

  ngOnInit(): void {
    console.log("1st", this.applicantList);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      searching: false
    };

  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  search() {
    if (Object.keys(this.searchModel).length === 0)
    {
      this.toastr.warning('Please fill search field at least one field!', 'All field empty!');
    }
    else {
      this._applicantSvc.getApplicantList(this.searchModel).subscribe(
        (res: any) => {
          this.applicantList = res;
          this.rerender()

          console.log(this.applicantList);
        },
        (error) => {
          console.log("Error: " , error.error.text);
        }
      );
    }
    console.log(this.searchModel)
  }







  check() {
    this.srcChip = []
    Object.entries(this.searchModel).forEach(([key, val]) => {
      this.srcChip.push({ display: this.niceName(key) + ": " + this.niceValue(key, val), value: key })
    })
  }

  onRemove(item) {
    console.log("removed",  item)
    switch(item.value) {
      case 'name':
        delete this.searchModel.name
        break
      case 'id_no':
        delete this.searchModel.id_no
        break
      case 'tel_hp':
        delete this.searchModel.tel_hp
        break
      case 'applyDate_from':
        delete this.searchModel.applyDate_from
        break
      case 'applyDate_to':
        delete this.searchModel.applyDate_to
        break
      case 'gender':
        delete this.searchModel.gender
        break
      case 'marital':
        delete this.searchModel.marital
        break
      case 'education':
        delete this.searchModel.education
        break
      case 'experience':
        delete this.searchModel.experience
        break
    }
  }

  niceValue(key: string, val: any) {
    let result = val
    switch (key) {
      case 'gender':
        if (val == 1)
            result = 'Male'
        else if (val == 2)
            result = 'Female'
        break;
      case 'marital':
        if (val == 1)
            result = 'Single'
        else if (val == 2)
            result = 'Married'
        break;
      case 'experience':
        if (val == 1)
            result = '< 1'
        else if (val == 2)
            result = '1 - 5'
        else if (val == 3)
            result = '5 - 10'
        else if (val == 4)
            result = '> 10'
        break;
      case 'education':
        if (val == 1)
            result = 'University'
        else if (val == 2)
            result = 'Senior High School'
        break;
    }
    return result
  }

  niceName(key: string) {
    let result
    let name = key.split('_').map(function(v) {
        return v.charAt(0).toUpperCase() + v.slice(1)
    })
    result = name.join(' ')
    return result
  }


}
