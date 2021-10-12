import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
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
    return this.http.post(this.baseUrl + 'applicant/search', search);
  }

}
