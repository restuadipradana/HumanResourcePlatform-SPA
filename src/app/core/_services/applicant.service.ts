import { TAttachment } from './../_models/t-attachment';
import { HApplicantEdit } from './../_models/h-applicant-edit';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { TApplicant } from '../_models/t-applicant';
import { HApplicantSearch } from '../_models/h-applicant-search';

@Injectable({
  providedIn: 'root'
})
export class ApplicantService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getApplicantList(search: HApplicantSearch) {
    console.log("search", search)
    return this.http.post(this.baseUrl + 'applicant/search', search);
  }

  esportExcel(search: HApplicantSearch) {
    return this.http.post(this.baseUrl + 'applicant/excel',{paramx: search},{responseType: 'blob' })
  }

  getPerson(id: string){
    return this.http.get<any>(this.baseUrl + 'applicant/person', {params : {id:id}})
  }

  async getImgStat(url: string){
    return this.http.get<any>(url, {}).toPromise();
  }

  async getPersonAsync(id: string){ //deprecated
    return this.http.get<any>(this.baseUrl + 'applicant/person', {params : {id:id}}).toPromise()
  }

  getImage(imageUrl: string): Observable<Blob> {
    return this.http.get(imageUrl, { responseType: 'blob' })
  }

  saveEmployee(model : HApplicantEdit) {
    return this.http.post(this.baseUrl + 'applicant/update-employee', model);
  }

  saveAttachment(model : any) {
    return this.http.post(this.baseUrl + 'applicant/update-attachment', model);
  }

  deleteAttachment(id, kind) {
    return this.http.post(this.baseUrl + 'applicant/delete-attachment', {applicant_id: id, kind: kind}, {});
  }

  // checkImageExist(url: string) {
  //   return this.http.request(new Request(url))
  //           .map((res: Response) => {
  //               if (res) {
  //                   if (res.status === 201) {
  //                       return [{ status: res.status, json: res }]
  //                   }
  //                   else if (res.status === 200) {
  //                       return [{ status: res.status, json: res }]
  //                   }
  //               }
  //           }).catch((error: any) => {
  //               if (error.status < 400 ||  error.status ===500) {
  //                   return Observable.throw(new Error(error.status));
  //               }
  //           })
  //           .subscribe(res => {...},
  //                      err => {console.log(err)} );
  // }

}
