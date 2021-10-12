import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ApplicantService } from '../../../core/_services/applicant.service';
import { HApplicantSearch } from '../../../core/_models/h-applicant-search';
import { TApplicant } from '../../../core/_models/t-applicant';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.scss']
})
export class ApplicantComponent implements OnInit {

  items = [];

  searchModel: any = {}

  srcChip = []

  constructor() { }

  ngOnInit(): void {

  }

  search() {
    if (Object.keys(this.searchModel).length === 0)
    {
      console.log("koso ")
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
