import { Component, OnInit, ViewChild, ElementRef, TemplateRef  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import {ModalDirective, BsModalService, BsModalRef} from 'ngx-bootstrap/modal';


import { ApplicantService } from '../../../core/_services/applicant.service';
import { HApplicantSearch } from '../../../core/_models/h-applicant-search';
import { TApplicant } from '../../../core/_models/t-applicant';
import { TApplicantConnection } from '../../../core/_models/t-applicant-connection';
import { TEducation } from '../../../core/_models/t-education';
import { TApplicantSkill } from '../../../core/_models/t-applicantskill';
import { TOccupation } from '../../../core/_models/t-occupation';
import { HApplicantEdit } from '../../../core/_models/h-applicant-edit';

@Component({
  selector: 'app-applicant-detail',
  templateUrl: './applicant-detail.component.html',
  styleUrls: ['./applicant-detail.component.scss']
})
export class ApplicantDetailComponent implements OnInit {

  cfmref?: BsModalRef;

  fileInfo: string;
  @ViewChild('labelCv')
  labelCv: ElementRef;
  @ViewChild('labelSkck')
  labelSkck: ElementRef;
  @ViewChild('labelAgreement')
  labelAgreement: ElementRef;
  @ViewChild('labelAssesment')
  labelAssesment: ElementRef;
  @ViewChild('labelCertificate')
  labelCertificate: ElementRef;
  @ViewChild('labelYAssesment')
  labelYAssesment: ElementRef;
  @ViewChild('labelSupporting')
  labelSupporting: ElementRef;

  base64_cv: any = null
  base64_skck: any = null
  base64_agreement: any = null
  base64_assessment: any = null
  base64_certificate: any = null
  base64_yearlyAssesment: any = null
  base64_supporting: any = null

  isAnyCv: boolean = false
  isAnySkck: boolean = false
  isAnyAgreement: boolean = false
  isAnyAssessment: boolean = false
  isAnyCertificate: boolean = false
  isAnyYearlyAssessment: boolean = false
  isAnySupportingDoc: boolean = false

  rootUrl: any = environment.attachmentUrl
  cvUrl: any = environment.attachmentUrl //+ "candidate_cv/"
  skckUrl: any = environment.attachmentUrl //+ "skck/"
  agreementUrl: any = environment.attachmentUrl //+ "agreement_contract/"
  assessmentUrl: any = environment.attachmentUrl //+ "assessment/"
  certificateUrl: any = environment.attachmentUrl //+ "certificate_employee/"
  yearlyAssessmentUrl: string[] = []
  supportingDocUrl: string[] = []


  public bcum: any = { title:'Applicants Detailxxx'};
  isLoad: boolean = false
  isUploading: boolean = false


  data_id: any
  person: any={}
  employee: any = {}
  attachment: any = {}
  setAttachment: any = {}
  editModelData: any = {}//HApplicantEdit
  editApplicantData: any = {} // HApplicantEdit = { id : null, name : null, nik: null, join_date: null, employee: { id: null, nik: null, applicant_id: null, join_date: null, end_probation: null, create_at: null, create_by: null, update_at: null, update_by: null}, attachment: { id: null, applicant_id: null, candidate_cv: null, skck: null, agreement_contract: null, assessment: null, certificate_employee: null, yearly_assessment: null, supporting_doc: null}}
  attachment_kind: string = ""

  constructor(private _applicantSvc: ApplicantService,
              private router : Router,
              private activatedroute:ActivatedRoute,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private modalService: BsModalService,) {  this.activatedroute.params.subscribe(data => { this.data_id = data.id }) }

  ngOnInit(): void {
    this.spinner.show()
    console.log(this.router.url)
    this.getPerson(this.data_id)
  }

  getPerson(id: string) {
    this._applicantSvc.getPerson(id).subscribe(
      (res: any) => {
        this.person = {}
        this.person = res;
        console.log(this.person);

        if (this.person.employee != null) {
          this.employee = this.person.employee
          this.employee.join_date = this.employee.join_date === undefined || this.employee.join_date === null ? null : this.employee.join_date.split('T')[0];
          this.employee.end_probation = this.employee.end_probation === undefined || this.employee.end_probation === null ? null : this.employee.end_probation.split('T')[0];
        }

        if (this.person.attachment != null) {
          this.attachment = this.person.attachment
          this.setAttachment = this.person.attachment

          this.isAnyCv = this.attachment.candidate_cv !== null ? true : false
          this.isAnySkck = this.attachment.skck !== null ? true : false
          this.isAnyAgreement = this.attachment.agreement_contract !== null ? true : false
          this.isAnyAssessment = this.attachment.assessment !== null ? true : false
          this.isAnyCertificate = this.attachment.certificate_employee !== null ? true : false
          this.isAnyYearlyAssessment = this.attachment.yearly_assessment !== null ? true : false
          this.isAnySupportingDoc = this.attachment.supporting_doc !== null ? true : false

          this.cvUrl = this.cvUrl + this.attachment.candidate_cv
          this.skckUrl = this.skckUrl + this.attachment.skck
          this.agreementUrl = this.agreementUrl + this.attachment.agreement_contract
          this.assessmentUrl = this.assessmentUrl + this.attachment.assessment
          this.certificateUrl = this.certificateUrl + this.attachment.certificate_employee

          console.log('yas : ' , this.attachment.yearly_assessment)

          if (this.attachment.yearly_assessment !== null ) {
            this.yearlyAssessmentUrl = JSON.parse(this.attachment.yearly_assessment)
          }
          if (this.attachment.supporting_doc !== null ) {
            this.supportingDocUrl = JSON.parse(this.attachment.supporting_doc)
          }

        }
        //var parjes = JSON.stringify(this.person)

        console.log('emp', this.employee)
        console.log('atc', this.attachment)
        this.spinner.hide()
      },
      (error) => {
        console.log("Error: " , error);
        this.spinner.hide()
      }
    )
  }

  onFileSelect(event, kind) {
    /**
     * KIND:
     * 0: CV: labelCv
     * 1: SKCK: labelSkck
     * 2: Agreement Contract: labelAgreement
     * 3: Assesment: labelAssesment
     * 4: Certificate of Employee: labelCertificate
     * 5: Yearly Assesment: labelYAssesment
     * 6: Other Supporting Doc: labelSupporting
     */

    let fileToUpload = <File>event.target.files[0];
    console.log(event.target.files[0])
    //console.log(fileToUpload)

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    var title = event.target.files[0].name.split(".").pop();
    var fileZise = event.target.files[0].size;
    console.log(title)
    console.log(fileZise)
    reader.onload = (event) => {

      if (title == "jpg" ||
        title == "jpeg" ||
        title == "png" ||
        title == "JPG" ||
        title == "JPEG" ||
        title == "PNG" ||
        title == "pdf" ||
        title == "PDF") {
        if (fileZise <= 2306867) { //2.2MB
          //console.log(event.target.result)
          switch(kind) {
            case 0:
              this.labelCv.nativeElement.innerText = fileToUpload.name
              this.setAttachment.cv_fileName = fileToUpload.name //not really used
              this.base64_cv = event.target.result
              break;
            case 1:
              this.labelSkck.nativeElement.innerText = fileToUpload.name
              this.setAttachment.skck_fileName = fileToUpload.name //not really used
              this.base64_skck = event.target.result
              break;
            case 2:
              this.labelAgreement.nativeElement.innerText = fileToUpload.name
              this.setAttachment.agreement_fileName = fileToUpload.name //not really used
              this.base64_agreement = event.target.result
              break;
            case 3:
              this.labelAssesment.nativeElement.innerText = fileToUpload.name
              this.setAttachment.assessment_fileName = fileToUpload.name //not really used
              this.base64_assessment = event.target.result
              break;
            case 4:
              this.labelCertificate.nativeElement.innerText = fileToUpload.name
              this.setAttachment.certificate_fileName = fileToUpload.name //not really used
              this.base64_certificate = event.target.result
              break;
            case 5:
              if (fileToUpload.name.length > 34) {
                this.toastr.warning('File name must be under 30 characters', 'File name too long!')
                break;
              }
              this.labelYAssesment.nativeElement.innerText = fileToUpload.name
              this.setAttachment.yearlyAssessment_fileName = fileToUpload.name
              this.base64_yearlyAssesment = event.target.result
              break;
            case 6:
              if (fileToUpload.name.length > 34) {
                this.toastr.warning('File name must be under 30 characters', 'File name too long!')
                break;
              }
              this.labelSupporting.nativeElement.innerText = fileToUpload.name
              this.setAttachment.supporting_fileName = fileToUpload.name
              this.base64_supporting = event.target.result
              break;
          }
        }
        else {
          this.toastr.warning('File size must be under 2MB!', 'File size too big!');
        }
      }
      else {
        this.toastr.warning('File must be image or pdf!', 'Wrong format!');
      }
    }

    // const file = fileSelect[0];
    // this.fileInfo = `${file.name} `;
  }

  submitEmployee() {
    this.isLoad = true
    this.editApplicantData.id = this.person.id
    this.editApplicantData.name = this.person.name.trim()
    this.editApplicantData.nik = this.employee.nik
    this.editApplicantData.join_date = this.employee.join_date
    this.employee.applicant_id = this.person.id
    this.editApplicantData.employee = this.employee

    this.setAttachment.applicant_id = this.person.id
    if (this.base64_cv != null) {
      this.setAttachment.candidate_cv = this.base64_cv
    }
    if (this.base64_skck != null) {
      this.setAttachment.skck = this.base64_skck
    }
    if (this.base64_agreement != null) {
      this.setAttachment.agreement_contract = this.base64_agreement
    }
    if (this.base64_assessment != null) {
      this.setAttachment.assessment = this.base64_assessment
    }
    if (this.base64_certificate != null) {
      this.setAttachment.certificate_employee = this.base64_certificate
    }
    if (this.base64_yearlyAssesment != null) {
      this.setAttachment.yearly_assessment = this.base64_yearlyAssesment
    }
    if (this.base64_supporting != null) {
      this.setAttachment.supporting_doc = this.base64_supporting
    }
    this.editApplicantData.attachment = this.setAttachment
    console.log("submit: ", this.editApplicantData)

    this._applicantSvc.saveEmployee(this.editApplicantData).subscribe(
      (res: any) => {
        console.log(res)
        this.toastr.success('Saving successful', 'Saved.!')
        this.isLoad = false
        this.reloadCurrentRoute()
      },
      (error) => {
        this.toastr.error("Uncaught error", "Error")
        console.log("Error: " , error);
        this.isLoad = false
      }
    )
  }


  openAttachment(url: any) {
    window.open(url,'Attachment','width=800,height=700')
    //this.router.navigate(['/pdf/'+id.toString()]);
  }

  fileName(url) {
    return url.split('_').pop()
  }

  openConfirm(template: TemplateRef<any>, kind) {
    this.cfmref = this.modalService.show(template, {class: 'modal-sm'});
    this.attachment_kind = kind
  }

  closeThisPage() {
    window.close()
  }

  confirm(): void {
    //delete atc
    this._applicantSvc.deleteAttachment(this.person.id, this.attachment_kind).subscribe(
      (res: any) => {
        console.log(res)
        this.toastr.success('Delete successful', 'Deleted.!')
        this.cfmref?.hide();
        this.reloadCurrentRoute()
      },
      (error) => {
        this.toastr.error("Uncaught error", "Error")
        console.log("Error: " , error);
      }
    )

  }

  decline(): void {
    this.cfmref?.hide();
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

}
