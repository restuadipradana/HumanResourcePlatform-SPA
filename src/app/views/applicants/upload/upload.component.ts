import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { ApplicantService } from '../../../core/_services/applicant.service';
import { DOCUMENT } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  constructor(private _applicantSvc: ApplicantService,  @Inject(DOCUMENT) private _document: Document) { }

  urlExcel: any = environment.sampleFileUrl

  dynamic: number;
  alertsDismiss: any = [];

  public progress: number;
  public message: string;

  @Output() public onUploadFinished = new EventEmitter();

  ngOnInit(): void {
  }

  showNotif(message: any, tipe: string) {
    this.alertsDismiss.push({
      type: tipe,
      msg: message,
      timeout: 6000
    });
  }

  downloadExample() {
    let url = this.urlExcel + 'UploadFromatGoogleForm.xlsx'
    let namafile = 'UploadFromatGoogleForm.xlsx'
    this._applicantSvc.getImage(url).subscribe((result: Blob) => {
      const blob = new Blob([result]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const currentTime = new Date();
      const filename = namafile
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    }, (error) => {
      console.log("Error: " , error);
    });
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append("Applican excel daya", fileToUpload, fileToUpload.name);
    this._applicantSvc.uploadApplicant(formData)
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
          this.showNotif("Upload successfully! This page will refresh", "info")
          setTimeout(() => {
            this._document.defaultView.location.reload();
          }, 4000);
        }
        console.log("suces", event);

      },
      (error) => {
        console.log("ero", error.error);
        this.showNotif(error.error, "danger");
        // setTimeout(() => {
        //   this._document.defaultView.location.reload();
        // }, 8000);

      });


  }

}
