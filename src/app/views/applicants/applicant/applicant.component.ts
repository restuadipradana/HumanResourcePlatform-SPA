import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from "ngx-spinner";
import {ModalDirective, BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import imageToBase64 from 'image-to-base64/browser'

import { ApplicantService } from '../../../core/_services/applicant.service';
import { HApplicantSearch } from '../../../core/_models/h-applicant-search';
import { TApplicant } from '../../../core/_models/t-applicant';
import { TApplicantConnection } from '../../../core/_models/t-applicant-connection';
import { TEducation } from '../../../core/_models/t-education';
import { TApplicantSkill } from '../../../core/_models/t-applicantskill';
import { retry } from 'rxjs/operators';
import { kill } from 'process';

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
  applicantConnection: TApplicantConnection[] = []
  applicantEducation: TEducation[] = []
  officeSkill: TApplicantSkill[] = []
  languageSkill: TApplicantSkill[] = []
  otherSkill: TApplicantSkill[] = []
  person: any={}
  srcChip = []
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  urlPhoto: any = environment.photoUrl
  foto: any
  ktp: any
  kk: any
  npwp: any
  ijazah: any
  vaksin: any

  constructor(private toastr: ToastrService,
              private _applicantSvc: ApplicantService,
              private spinner: NgxSpinnerService,
              private modalService: BsModalService,
              private router: Router) { }

  ngOnInit(): void {
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
      this.spinner.show()
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
          this.spinner.hide()
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
    )
  }

  generatePDF(id: string, action: string) {
    this.spinner.show()
    this._applicantSvc.getPerson(id).subscribe(
      (res: any) => {
        this.showPdf(res, action)

      }, //end of http request
      (error) => {
        this.toastr.error('Failed to open CV :(', 'Oops.. Something wrong..!');
        console.log("Error: " , error.error.text);
        this.spinner.hide()
      }
    )
  }

  downloadPhoto(id: string, kind: string) {
    this._applicantSvc.getPerson(id).subscribe(
      (res: any) => {
        let nama = res.name.trim().replace(/ /g, '%20')
        let urlx = ''
        let namafile = ''

        if (kind === 'foto') {
          urlx = this.urlPhoto + res.id + '.%20' + nama + '.png'
          namafile = res.id + '. ' + res.name.trim() + '.png'
        }
        else if (kind === 'ktp') {
          urlx = this.urlPhoto + 'ktp/' + res.id + '.%20' + 'KTP%20' + nama + '.png'
          namafile =  res.id + '. ' + 'KTP ' + res.name.trim() + '.png'
        }
        else if (kind === 'kk') {
          urlx = this.urlPhoto + 'kk/' + res.id + '.%20' + 'KK%20' + nama + '.png'
          namafile = res.id + '. ' + 'KK ' + res.name.trim() + '.png'
        }
        else if (kind === 'npwp') {
          urlx = this.urlPhoto + 'npwp/' + res.id + '.%20' + 'NPWP%20' + nama + '.png'
          namafile = res.id + '. ' + 'NPWP ' + res.name.trim() + '.png'
        }
        else if (kind === 'ijazah') {
          urlx = this.urlPhoto + 'ijazah/' + res.id + '.%20' + 'IJAZAH%20' + nama + '.png'
          namafile = res.id + '. ' + 'IJAZAH ' + res.name.trim() + '.png'
        }
        else if (kind === 'vaksin') {
          urlx = this.urlPhoto + 'vaksin/' + res.id + '.%20' + 'VAKSIN%20' + nama + '.png'
          namafile = res.id + '. ' + 'VAKSIN ' + res.name.trim() + '.png'
        }

        this._applicantSvc.getImage(urlx).subscribe((result: Blob) => {
          const blob = new Blob([result]);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          const currentTime = new Date();
          const filename = namafile
          link.href = url;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
        });

      }, //end of http request
      (error) => {
        this.toastr.error('No image found!');
        console.log("Error: " , error.error.text);
      }
    )
  }

  async showPdf(res: any, action: string) {
    this.person = {}
    this.applicantConnection = []
    this.applicantEducation = []
    this.person = res;
    this.applicantConnection = this.person.connections
    this.applicantEducation = this.person.educations
    this.officeSkill = this.person.officeSkills
    this.languageSkill = this.person.languageSkills
    this.otherSkill = this.person.othersSkills
    let officeskl = ''
    officeskl = this.officeSkill.map(val => officeskl + val.skill.name.trim()).toString()
    let langskl = ''
    langskl = this.languageSkill.map(val => langskl + val.skill.name.trim() + '(' + val.skill.remark.trim() + ')').toString()
    let otherskl = ''
    otherskl = this.otherSkill.map(val => otherskl + val.skill.name.trim()).toString()

    this.urlPhoto = environment.photoUrl
    let nama = this.person.name.trim().replace(/ /g, '%20')
    let urlFoto = this.urlPhoto + this.person.id + '.%20' + nama + '.png'
    let urlKtp = this.urlPhoto + 'ktp/' + this.person.id + '.%20' + 'KTP%20' + nama + '.png'
    let urlKk = this.urlPhoto + 'kk/' + this.person.id + '.%20' + 'KK%20' + nama + '.png'
    let urlNpwp = this.urlPhoto + 'npwp/' + this.person.id + '.%20' + 'NPWP%20' + nama + '.png'
    let urlIjazah = this.urlPhoto + 'ijazah/' + this.person.id + '.%20' + 'IJAZAH%20' + nama + '.png'
    let urlVaksin = this.urlPhoto + 'vaksin/' + this.person.id + '.%20' + 'VAKSIN%20' + nama + '.png'

    //this.urlPhoto = urlFoto
    var imagex =  await this.getBase64ImageFromURL(environment.photoUrl + 'notfound.png') //default image
    this.foto = imagex // await this.getPhoto(urlFoto, 'foto')//imagex
    this.ktp = imagex
    this.kk = imagex
    this.npwp = imagex
    this.ijazah = imagex
    this.vaksin = imagex

    await this._applicantSvc.getImgStat(urlFoto).then(
      () => {
      },
      async (error) => { //pasti error karna bukan blob, cuma mau dapatkan status
        if (error.status == 200) {
          this.foto =  await this.getBase64ImageFromURL(urlFoto)
        }
      }
    )
    await this._applicantSvc.getImgStat(urlKtp).then(
      () => {
      },
      async (error) => { //pasti error karna bukan blob, cuma mau dapatkan status
        if (error.status == 200) {
          this.ktp =  await this.getBase64ImageFromURL(urlKtp)
        }
      }
    )
    await this._applicantSvc.getImgStat(urlKk).then(
      () => {
      },
      async (error) => { //pasti error karna bukan blob, cuma mau dapatkan status
        if (error.status == 200) {
          this.kk =  await this.getBase64ImageFromURL(urlKk)
        }
      }
    )
    await this._applicantSvc.getImgStat(urlNpwp).then(
      () => {
      },
      async (error) => { //pasti error karna bukan blob, cuma mau dapatkan status
        if (error.status == 200) {
          this.npwp =  await this.getBase64ImageFromURL(urlNpwp)
        }
      }
    )
    await this._applicantSvc.getImgStat(urlIjazah).then(
      () => {
      },
      async (error) => { //pasti error karna bukan blob, cuma mau dapatkan status
        if (error.status == 200) {
          this.ijazah =  await this.getBase64ImageFromURL(urlIjazah)
        }
      }
    )
    await this._applicantSvc.getImgStat(urlVaksin).then(
      () => {
      },
      async (error) => { //pasti error karna bukan blob, cuma mau dapatkan status
        if (error.status == 200) {
          this.vaksin =  await this.getBase64ImageFromURL(urlVaksin)
        }
      }
    )

    let docDefinition = {
      info: {
        title: this.person.id + ' ' + this.person.name.trim(),
        author: 'HRP',
        subject: 'CV',
        keywords: 'nokeyword',
      },
      header: [
        {
          text: [
            { text: 'PT. Tah Sung Hung\n', fontSize: 20, alignment: 'center', color: '#2e2e2e' },
            { text: 'Curriculum Vitae', fontSize: 16, alignment: 'center', color: '#2e2e2e' },
          ] ,
        },
      ],
      footer: {
        columns: [
          '',//left
          { text: 'TSH8137 (05/05/2020)', alignment: 'right' }
        ]
      },
      content: [
        {
          text: 'Apply Date: ' + new Date(this.person.apply_date).toLocaleDateString(),
          fontSize: 7,
          alignment: 'center'
        },
        {
          columns: [
            {
              width: '85%',
              table: {
                headerRows: 1,
                widths: ['40%', '60%'],
                body: [
                  [{text: 'SEEKING FOR JOB', colSpan: 2, style: 'sectionHeader', bold: true}, {}],
                  [{text: 'Soonest working date', style: 'sectionContent', bold: true}, {text: new Date(this.person.soonest_working_date).toLocaleDateString(), style: 'sectionContent'}],
                  [{text: 'Salary', style: 'sectionContent', bold: true}, {text: this.person.salary === 0 ? 'Company Requirements' : this.person.country.currency + this.person.salary, style: 'sectionContent'}]
                ]
              }
            },
            {
              width: '15%',
              table: {
                headerRows: 1,
                widths: ['100%'],
                body: [
                  [{image:  this.foto , fit: [85, 100], alignment: 'center',}],
                  [{text: '0000', style: 'sectionContent'}],
                  [{text: '01/01/2001', style: 'sectionContent'}],
                ]
              }
              //text: 'Foroo'

              //image: this.imgToBase64(this.urlPhoto),

              // height: 200
            }
          ],
          // optional space between columns
          columnGap: 10
        },
        {
          text: ' ',
          fontSize: 15,
        },
        {
          table: {
            headerRows: 1,
            widths: ['14%', '27%', '12%', '21%', '12%', '14%'], // -2
            body: [
              [{text: 'PERSONAL IDENTITY', colSpan: 6, style: 'sectionHeader', bold: true}, {}, {}, {}, {}, {}],
              [
                {text: 'Name', style: 'sectionContent', bold: true},
                {text: this.person.name, style: 'sectionContent'},
                {text: 'ID No.', style: 'sectionContent', bold: true},
                {text: this.person.ktp, style: 'sectionContent'},
                {text: 'Gender', style: 'sectionContent', bold: true},
                {text: this.person.gender === 1 ? 'Male' : 'Female', style: 'sectionContent'}
              ],
              [
                {text: 'Birthday', style: 'sectionContent', bold: true},
                {text: new Date(this.person.birthday).toLocaleDateString(), style: 'sectionContent'},
                {text: 'Place of Birth', style: 'sectionContent', bold: true},
                {text: this.person.birthplace.name, style: 'sectionContent'},
                {text: 'Religion', style: 'sectionContent', bold: true},
                {text: this.getNiceValue('religion', this.person.religion), style: 'sectionContent'}
              ],
              [
                {text: 'Email', style: 'sectionContent', bold: true},
                {text: this.person.email, style: 'sectionContent'},
                {text: 'No. Telephone', style: 'sectionContent', bold: true},
                {text: this.person.tel_hp, style: 'sectionContent'},
                {text: 'Refrence', style: 'sectionContent', bold: true},
                {text: this.person.reference, style: 'sectionContent'}
              ],
              [
                {text: 'Current Address', style: 'sectionContent', bold: true},
                {text: this.person.address, style: 'sectionContent',  colSpan: 3},
                {},
                {},
                {text: 'Nationality', style: 'sectionContent', bold: true},
                {text: this.person.national.name, style: 'sectionContent'}
              ],
              [
                {text: 'Marital Status', style: 'sectionContent', bold: true},
                {text: this.person.marital  === 1 ? "Single" : "Married", style: 'sectionContent'},
                {text: 'NPWP', style: 'sectionContent', bold: true},
                {text: this.person.npwp, style: 'sectionContent'},
                {text: 'Dependent', style: 'sectionContent', bold: true},
                {text: this.person.dependent, style: 'sectionContent'}
              ],
            ]
          }
        },
        {
          text: ' ',
          fontSize: 15,
        },
        {
          table: {
            headerRows: 1,
            widths: ['10%', '25%', '8%', '22%', '19%', '16%'], //
            body: [
              [{text: 'FAMILY', colSpan: 6, style: 'sectionHeader', bold: true}, {}, {}, {}, {}, {}],
              [
                {text: 'Relation', style: 'sectionContent', bold: true},
                {text: 'Name', style: 'sectionContent', bold: true},
                {text: 'Age', style: 'sectionContent', bold: true},
                {text: 'Job', style: 'sectionContent', bold: true},
                {text: 'Emergency Contact', style: 'sectionContent', bold: true},
                {text: 'Telephone', style: 'sectionContent', bold: true},
              ],
              ...this.applicantConnection.map(p => (
                [
                  {text: this.getNiceValue('relation', p.relation) , style: 'sectionContent'},
                  {text: p.name, style: 'sectionContent'},
                  {text: p.age, style: 'sectionContent'},
                  {text: p.job, style: 'sectionContent'},
                  {text: p.emergency === 1 ? "Yes" : "No", style: 'sectionContent'},
                  {text: p.telephone, style: 'sectionContent'}
                ]))
            ]
          }
        },
        {
          text: ' ',
          fontSize: 15,
        },
        {
          table: {
            headerRows: 1,
            widths: ['15%', '35%', '25%', '16%', '9%'], // EDUCATION tinggak bikin model Education trus di map
            body: [
              [{text: 'EDUCATION', colSpan: 5, style: 'sectionHeader', bold: true}, {}, {}, {}, {}],
              [
                {text: 'Degree', style: 'sectionContent', bold: true},
                {text: 'School Name', style: 'sectionContent', bold: true},
                {text: 'Major', style: 'sectionContent', bold: true},
                {text: 'Time', style: 'sectionContent', bold: true},
                {text: 'Graduated', style: 'sectionContent', bold: true},
              ],
              ...this.applicantEducation.map(p => (
                [
                  {text: this.getNiceValue('degree', p.type) , style: 'sectionContent'},
                  {text: p.school_name, style: 'sectionContent'},
                  {text: p.major_name, style: 'sectionContent'},
                  {text: p.begin + ' - ' + p.end, style: 'sectionContent'},
                  {text: p.graduated === 1 ? "Yes" : "No", style: 'sectionContent'}
                ]))
            ]
          }
        },
        {
          text: ' ',
          fontSize: 15,
        },
        {
          table: {
            headerRows: 1,
            widths: ['40%', '40%', '20%'],
            body: [
              [{text: 'SKILL', colSpan: 3, style: 'sectionHeader', bold: true}, {}, {}],
              [
                {text: 'Office', style: 'sectionContent', bold: true},
                {text: 'Language', style: 'sectionContent', bold: true},
                {text: 'Others', style: 'sectionContent', bold: true},
              ],
              [
                {text: officeskl , style: 'sectionContent'},
                {text: langskl, style: 'sectionContent'},
                {text: otherskl, style: 'sectionContent'},
              ]
            ]
          }
        },
        {
          text: ' ',
          fontSize: 15,
        },
        {
          table: {
            headerRows: 1,
            widths: ['15%', '20%', '15%', '20%', '15%', '15%'],
            body: this.person.experiences.length !== 0 ?
            [
              [{text: 'WORKING EXPERIENCE', colSpan: 6, style: 'sectionHeader', bold: true},  {}, {}, {}, {}, {}],
              [
                {text: 'Company Name', style: 'sectionContent', bold: true},
                {text: this.person.experiences[0].company_name, colSpan: 3, style: 'sectionContent'},
                {},
                {},
                {text: 'Time', style: 'sectionContent', bold: true},
                {text: this.person.experiences[0].begin + '-' + this.person.experiences[0].end, style: 'sectionContent'},
              ],
              [
                {text: 'Salary', style: 'sectionContent', bold: true},
                {text: this.person.experiences[0].country.currency + this.person.experiences[0].salary, style: 'sectionContent'},
                {text: 'Working Location', style: 'sectionContent', bold: true},
                {text: this.person.experiences[0].location?.name, style: 'sectionContent'},
                {text: 'Resign Reason', style: 'sectionContent', bold: true},
                {text: this.person.experiences[0].resign_reason, style: 'sectionContent'},
              ]
            ] :
            [[{text: 'NO HAVE WORKING EXPERIENCE', colSpan: 6, style: 'sectionHeader', bold: true},  {}, {}, {}, {}, {}],]
          }
        },
        {
          text: ' ',
          fontSize: 15,
        },
        {
          table: {
            headerRows: 1,
            widths: ['98%', '2%'],
            body: [
              [{text: 'DECLARATION', colSpan: 2, style: 'sectionHeader', bold: true}, {}],
              [
                {text: 'I declare that the information data in this application is true and accurate. I understand that any misrepresentation of ' +
                'facts given here in with be sufficient cause of dismissal from the companys\' service if I have been employed', style: 'sectionContent'},
                {text: '√', style: 'sectionContent'},
              ]
            ]
          }
        },
        {
          text: '',
          fontSize: 14,
          bold: true,
          alignment: 'right',
          color: '#2e2e2e',
          pageBreak: "before"
        },
        {
          table: {
            headerRows: 1,
            widths: ['100%'],
            body: [
              [{text: 'ATTACHMENT', style: 'sectionHeader', bold: true}],
            ]
          }
        },
        {
          text: ' ',
          fontSize: 15,
        },
        {image:  this.ktp , fit: [270, 150], alignment: 'center',},
        {
          text: ' ',
          fontSize: 10,
        },
        {image:  this.kk , fit: [525, 390], alignment: 'center',},
        {
          text: ' ',
          fontSize: 10,
        },
        {image:  this.npwp , fit: [270, 150], alignment: 'center',},
        {
          text: '',
          fontSize: 14,
          bold: true,
          alignment: 'right',
          color: '#2e2e2e',
          pageBreak: "before"
        },
        {
          table: {
            headerRows: 1,
            widths: ['100%'],
            body: [
              [{text: 'IJAZAH', style: 'sectionHeader', bold: true}],
            ]
          }
        },
        {
          text: ' ',
          fontSize: 15,
        },
        {image:  this.ijazah , fit: [450, 750], alignment: 'center',},
        {
          text: '',
          fontSize: 14,
          bold: true,
          alignment: 'right',
          color: '#2e2e2e',
          pageBreak: "before"
        },
        {
          table: {
            headerRows: 1,
            widths: ['100%'],
            body: [
              [{text: 'VACCINE CERTIFICATE', style: 'sectionHeader', bold: true}],
            ]
          }
        },
        {
          text: ' ',
          fontSize: 10,
        },
        {image:  this.vaksin , fit: [450, 750], alignment: 'center',},
      ],
      styles: {
        sectionHeader: {
          bold: true,
          fontSize: 11,
          alignment: 'center',
          fillColor: '#757474',
          color: '#ededed'
        },
        sectionContent: {
          bold: false,
          fontSize: 9,
          //margin: [0, 15,0, 15]
        }
      },
      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      pageMargins: [ 10, 46, 10, 18 ],

    };

    if(action==='download'){
      pdfMake.createPdf(docDefinition).download(this.person.id + ' ' + this.person.name.trim())
    }else{
      var win = window.open('' + 'ehhehe' ,'name','width=800,height=700')
      pdfMake.createPdf(docDefinition).open({}, win)
    }
    this.spinner.hide()
  }



/* -------------- IMAGE PDF RESOURCE BEGIN ------------------ */

  async getPhoto(url, kind) { //buggy - no use --
    console.log(2)
    await this._applicantSvc.getImgStat(url).then(
      () => {
      },
      async (error) => { //pasti error karna bukan blob, cuma mau dapatkan status
        if (error.status == 200) {
          console.log(3)
          if (kind === 'foto') {
            this.foto =  await this.getBase64ImageFromURL(url)
            console.log(31)
          }
          else if (kind === 'ktp') {
            this.ktp =  await this.getBase64ImageFromURL(url)
          }
          else if (kind === 'kk') {
            this.kk =  await this.getBase64ImageFromURL(url)
          }
          else if (kind === 'npwp') {
            this.npwp =  await this.getBase64ImageFromURL(url)
          }
          else if (kind === 'ijazah') {
            this.ijazah =  await this.getBase64ImageFromURL(url)
          }
          else if (kind === 'vaksin') {
            this.vaksin =  await this.getBase64ImageFromURL(url)
          }
        }
      }
    )
    console.log(5)
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }


/* -------------- IMAGE RESOURCE BEGIN ------------------ */


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

  /*-----------OTHER-------------- */

  getNiceValue(key:string, val: number) //PDF value
  {
    var result = "";
    switch (key)
    {
      case "relation":
        if (val == 1)
          result = "Father";
        else if (val == 2)
          result = "Mother";
        else if (val == 3)
          result = "Husband";
        else if (val == 4)
          result = "Wife";
        else if (val == 5)
          result = "Children";
        else if (val == 6)
          result = "Uncle";
        else if (val == 7)
          result = "Aunt";
        else if (val == 8)
          result = "Cousin";
        else if (val == 9)
          result = "Sibling";
        break;
      case "gender":
        if (val == 1)
          result = "Male";
        else if (val == 2)
          result = "Female";
        break;
      case "marital":
        if (val == 1)
          result = "Single";
        else if (val == 2)
          result = "Married";
        break;
      case "degree":
        if (val == 1)
          result = "Non Formal";
        else if (val == 2)
          result = "Senior High School";
        else if (val == 3)
          result = "Bachelor";
        else if (val == 4)
          result = "Master";
        else if (val == 5)
          result = "Doctor";
        else if (val == 6)
          result = "Diploma";
        break;
      case "religion":
        if (val == 1)
          result = "Islam";
        else if (val == 2)
          result = "Buddha";
        else if (val == 3)
          result = "Protestant";
        else if (val == 4)
          result = "Confucius";
        else if (val == 5)
          result = "Hindu";
        else if (val == 6)
          result = "Catholic";
        else if (val == 6)
          result = "-";
        break;
    }
    return result;
  }

  /* -----------------DEPRECATED---------------------- */
  openPDF(id: number) {
    window.open('/#/pdf/' + id,'name','width=800,height=700')
    //this.router.navigate(['/pdf/'+id.toString()]);
  }

}
