import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from "ngx-spinner";
import {ModalDirective, BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

import { ApplicantService } from '../../../core/_services/applicant.service';
import { HApplicantSearch } from '../../../core/_models/h-applicant-search';
import { TApplicant } from '../../../core/_models/t-applicant';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.scss']
})
export class ApplicantComponent implements OnInit, OnDestroy, AfterViewInit {

  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
    class: 'modal-lg'
  };
  cfmconfig = {
    backdrop: true,
    ignoreBackdropClick: false,
    keyboard: true,
    class: 'modal-sm modal-warning'
  };
  modalRef?: BsModalRef;
  cfmmodalRef?: BsModalRef;

  searchModel: any = {}
  applicantList: TApplicant[] = []
  person: any={}
  srcChip = []
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  //dtTrigger: Subject = new Subject();

  constructor(private toastr: ToastrService,
              private _applicantSvc: ApplicantService,
              private spinner: NgxSpinnerService,
              private modalService: BsModalService,
              private router: Router) { }

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
      this.spinner.show()
      this._applicantSvc.getApplicantList(this.searchModel).subscribe(
        (res: any) => {
          this.applicantList = res;
          this.rerender()

          console.log(this.applicantList);
          this.spinner.hide()
        },
        (error) => {
          console.log("Error: " , error.error.text);
          this.spinner.hide()
        }
      );
    }
    console.log(this.searchModel)
  }

  exportExcel() {
    if (Object.keys(this.searchModel).length === 0)
    {
      this.toastr.warning('Please fill search field at least one field!', 'All field empty!');
    }
    else {
      this._applicantSvc.esportExcel(this.searchModel)
        .subscribe((result: Blob) => {
          if (result.type !== 'application/xlsx') {
            alert(result.type);
          }
          const blob = new Blob([result]);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          const currentTime = new Date();
          const filename = 'Applicant'  + '.xlsx';
          link.href = url;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
      });
    }
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

  openPDF(id: number) {
    window.open('/#/pdf/' + id,'name','width=800,height=700')
    //this.router.navigate(['/pdf/'+id.toString()]);
  }


/* -------------- MODAL ENGINE BEGIN ------------------ */
  modalOption(whatclose: number, template?: TemplateRef<any>) {
    switch(whatclose) {
      case 0: //confirm close yes
        this.modalRef?.hide()
        this.cfmmodalRef?.hide()
        break
      case 1: //confirm close no
        this.cfmmodalRef?.hide()
        break
      case 2: //open confirm
        this.cfmmodalRef = this.modalService.show(template, this.cfmconfig)
        break
      case 3: //main modal close
        this.modalRef?.hide()
    }
  }

  openModal(template: TemplateRef<any>, id: number) {
    this.modalRef = this.modalService.show(template, this.config);
    this.getPerson(id.toString())
    console.log(id.toString())
  }

/* -------------- MODAL ENGINE END ------------------ */



/* -------------- CHIP ENGINE BEGIN ------------------ */
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

  /* -------------- CHIP ENGINE END ------------------ */


}
