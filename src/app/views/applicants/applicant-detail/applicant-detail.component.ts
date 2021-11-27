import { Component, OnInit, ViewChild, ElementRef, TemplateRef  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent, Dimensions, ImageTransform, base64ToFile } from 'ngx-image-cropper';
import {ModalDirective, BsModalService, BsModalRef} from 'ngx-bootstrap/modal';

import { ApplicantService } from '../../../core/_services/applicant.service';

@Component({
  selector: 'app-applicant-detail',
  templateUrl: './applicant-detail.component.html',
  styleUrls: ['./applicant-detail.component.scss']
})
export class ApplicantDetailComponent implements OnInit {

  //  -----------------------foto-ktp-kk-npwp-ijazah-vaksin--
  imageChangedEvent:  any[] = ['', '', '', '', '', ''];
  croppedImage:       any[] = ['', '', '', '', '', ''];
  canvasRotation            = [ 0,  0,  0,  0,  0,  0];
  rotation                  = [ 0,  0,  0,  0,  0,  0];
  scale                     = [ 1,  1,  1,  1,  1,  1];
  transform: ImageTransform[]=[{}, {}, {}, {}, {}, {}];
  showCropper = [false, false, false, false, false, false];
  containWithinAspectRatio = [false, false, false, false, false, false];

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
  @ViewChild('labelFoto')
  labelFoto: ElementRef;
  @ViewChild('labelKtp')
  labelKtp: ElementRef;
  @ViewChild('labelKk')
  labelKk: ElementRef;
  @ViewChild('labelNpwp')
  labelNpwp: ElementRef;
  @ViewChild('labelIjazah')
  labelIjazah: ElementRef;
  @ViewChild('labelVaksin')
  labelVaksin: ElementRef;

  base64_cv: any = null
  base64_skck: any = null
  base64_agreement: any = null
  base64_assessment: any = null
  base64_certificate: any = null
  base64_yearlyAssesment: any = null
  base64_supporting: any = null
  base64_foto: any = null
  base64_ktp: any = null
  base64_kk: any = null
  base64_npwp: any = null
  base64_ijazah: any = null
  base64_vaksin: any = null

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

  urlPhoto: any = environment.photoUrl
  url_foto: any
  url_ktp: any
  url_kk: any
  url_npwp: any
  url_ijazah: any
  url_vaksin: any
  url_notfound: any = environment.photoUrl + 'noimg.png'

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
    //console.log(this.router.url)
    this.getPerson(this.data_id)
  }

  getPerson(id: string) {
    this._applicantSvc.getPerson(id).subscribe(
      (res: any) => {
        this.person = {}
        this.person = res;
        //console.log(this.person);

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

          //console.log('yas : ' , this.attachment.yearly_assessment)

          if (this.attachment.yearly_assessment !== null ) {
            this.yearlyAssessmentUrl = JSON.parse(this.attachment.yearly_assessment)
          }
          if (this.attachment.supporting_doc !== null ) {
            this.supportingDocUrl = JSON.parse(this.attachment.supporting_doc)
          }

        }
        let nama = this.person.name.trim()
        this.url_foto = this.urlPhoto + res.id + '.%20' + nama + '.png'
        this.url_ktp = this.urlPhoto + 'ktp/' + res.id + '.%20' + 'KTP%20' + nama + '.png'
        this.url_kk = this.urlPhoto + 'kk/' + res.id + '.%20' + 'KK%20' + nama + '.png'
        this.url_npwp = this.urlPhoto + 'npwp/' + res.id + '.%20' + 'NPWP%20' + nama + '.png'
        this.url_ijazah = this.urlPhoto + 'ijazah/' + res.id + '.%20' + 'IJAZAH%20' + nama + '.png'
        this.url_vaksin = this.urlPhoto + 'vaksin/' + res.id + '.%20' + 'VAKSIN%20' + nama + '.png'

        //console.log('emp', this.employee)
        //console.log('atc', this.attachment)
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
    //console.log(event.target.files[0])
    //console.log(fileToUpload)

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    var title = event.target.files[0].name.split(".").pop();
    var fileZise = event.target.files[0].size;
    //console.log(title)
    //console.log(fileZise)
    reader.onload = (event) => {
      //console.log(event.target.result)

      if (title == "jpg" ||
        title == "jpeg" ||
        title == "png" ||
        title == "JPG" ||
        title == "JPEG" ||
        title == "PNG" ||
        title == "pdf" ||
        title == "PDF") {
        if (fileZise <= 2306867) { //2.2MB
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
    if (this.croppedImage[0] !== '') { //foto
      this.setAttachment.foto = this.croppedImage[0]
    }
    if (this.croppedImage[1] !== '') { //ktp
      this.setAttachment.ktp = this.croppedImage[1]
    }
    if (this.croppedImage[2] !== '') { //kk
      this.setAttachment.kk = this.croppedImage[2]
    }
    if (this.croppedImage[3] !== '') { //npwp
      this.setAttachment.npwp = this.croppedImage[3]
    }
    if (this.croppedImage[4] !== '') { //ijazah
      this.setAttachment.ijazah = this.croppedImage[4]
    }
    if (this.croppedImage[5] !== '') { //vaksin
      this.setAttachment.vaksin = this.croppedImage[5]
    }

    this.editApplicantData.attachment = this.setAttachment
    console.log("submit: ", this.editApplicantData)

    this._applicantSvc.saveEmployee(this.editApplicantData).subscribe(
      (res: any) => {
        //console.log(res)
        this.toastr.success('Saving successful', 'Saved.!')
        this.isLoad = false
        this.reloadCurrentRoute()
      },
      (error) => {
        this.toastr.error("Uncaught error", "Error")
        console.log("Error: " , error);
        this.isLoad = false
        if (error.status === 401)
        {
          this.router.navigate(["/login"]);
        }
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
        //console.log(res)
        this.toastr.success('Delete successful', 'Deleted.!')
        this.cfmref?.hide();
        this.reloadCurrentRoute()
      },
      (error) => {
        this.toastr.error("Uncaught error", "Error")
        console.log("Error: " , error);
        if (error.status === 401)
        {
          this.router.navigate(["/login"]);
        }
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

  //---------block image croper ------------
  fileChangeEvent(event: any, kind: number): void {
    var title = event.target.files[0].name.split(".").pop();
    var fileZise = event.target.files[0].size;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = rs => {
        const img_width = rs.currentTarget['width']; //lebar
        const img_height = rs.currentTarget['height']; //tinggi
        //console.log('img res ', img_width, img_height);
        //console.log('img base ', e.target.result);
        if (title == "jpg" || title == "jpeg" || title == "png" || title == "JPG" || title == "JPEG" || title == "PNG" ) {
          if (fileZise <= 2306867) {
            switch(kind) {
              case 0: //foto
                if (img_width > 199 && img_height > 299) {
                  this.imageChangedEvent[kind] = event;
                  this.labelFoto.nativeElement.innerText = this.imageChangedEvent[0].target.files[0].name
                  break
                }
                else {
                  this.toastr.warning('Minimumm image resolution is 200px x 300px')
                  break
                }
              case 1: //ktp
                if (img_width > 349 && img_height > 219) {
                  this.imageChangedEvent[kind] = event;
                  this.labelKtp.nativeElement.innerText = this.imageChangedEvent[1].target.files[0].name
                  break
                }
                else {
                  this.toastr.warning('Minimumm image resolution is 350px x 200px')
                  break
                }
              case 2: //kk
                if (img_width > 999 && img_height > 699) {
                  this.imageChangedEvent[kind] = event;
                  this.labelKk.nativeElement.innerText = this.imageChangedEvent[2].target.files[0].name
                  break
                }
                else {
                  this.toastr.warning('Minimumm image resolution is 1000px x 700px')
                  break
                }
              case 3: //npwp
                if (img_width > 349 && img_height > 219) {
                  this.imageChangedEvent[kind] = event;
                  this.labelKk.nativeElement.innerText = this.imageChangedEvent[3].target.files[0].name
                  break
                }
                else {
                  this.toastr.warning('Minimumm image resolution is 350px x 200px')
                  break
                }
              case 4: //ijazah
                this.imageChangedEvent[kind] = event;
                this.croppedImage[kind] = e.target.result;
                this.labelKk.nativeElement.innerText = this.imageChangedEvent[4].target.files[0].name
                break
              case 5: //vaksin
                this.imageChangedEvent[kind] = event;
                this.croppedImage[kind] = e.target.result;
                this.labelKk.nativeElement.innerText = this.imageChangedEvent[5].target.files[0].name
                break
            }
            console.log(this.imageChangedEvent)
          }
          else {
            this.toastr.warning('File size must be under 2MB!', 'File size too big!');
          }
        }
        else {
          this.toastr.warning('File must be image', 'Wrong format!');
        }
      }
    }
    reader.readAsDataURL(event.target.files[0]);

  }

  imageCropped(event: ImageCroppedEvent, kind: number) {
    this.croppedImage[kind] = event.base64;
    //console.log(event, base64ToFile(event.base64));
    //console.log('b evt', this.croppedImage);
  }

  imageLoaded(kind: number) {
    this.showCropper[kind] = true;
    console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions, kind: number) {
    //console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    console.log('Load failed');
  }

  rotateLeft(kind: number) {
    this.canvasRotation[kind]--;
    this.flipAfterRotate(kind);
  }

  rotateRight(kind: number) {
    this.canvasRotation[kind]++;
    this.flipAfterRotate(kind);
  }

  private flipAfterRotate(kind: number) {
    const flippedH = this.transform[kind].flipH;
    const flippedV = this.transform[kind].flipV;
    this.transform[kind] = {
      ...this.transform[kind],
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  resetImage(kind: number) {
    this.scale[kind] = 1;
    this.rotation[kind] = 0;
    this.canvasRotation[kind] = 0;
    this.transform[kind] = {};
  }

  updateRotation(kind: number) {
    this.transform[kind] = {
      ...this.transform[kind],
      rotate: this.rotation[kind],
    };
  }

}
