import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jspdf from 'jspdf';
//import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Subject, Observable, Subscription } from 'rxjs';
import { ApplicantService } from '../../core/_services/applicant.service';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;



@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.scss']
})
export class PdfViewComponent implements OnInit {

  // public SavePDF(): void {
  //   let content=this.content.nativeElement;
  //   let doc = new jsPDF('p', 'pt', 'a4');
  //   let _elementHandlers =
  //   {
  //     '#editor':function(element,renderer){
  //       return true;
  //     }
  //   };
  //   doc.fromHTML(content.innerHTML,15,15,{

  //     'width':190,
  //     'elementHandlers':_elementHandlers
  //   });

  //   doc.save('test.pdf');
  // }
  public captureScreen()
  {
    var data = document.getElementById('content');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('MYPdf.pdf'); // Generated PDF
      pdf.output('pdfobjectnewwindow');
    });
  }

  id_applicant: string
  person: any={}

  @ViewChild('content') content:ElementRef;

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
        this.generatePDF()

        console.log(this.person);
        //this.captureScreen()
      },
      (error) => {
        console.log("Error: " , error.error.text);
      }
    );
  }


  generatePDF() {
    let docDefinition = {
      header: 'C#Corner PDF Header',
      content: 'Sample PDF generated with Angular and PDFMake for C#Corner Blog'
    };

    pdfMake.createPdf(docDefinition).open()
  }


}
