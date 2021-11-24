import { AuthService } from './../../core/_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit{
  user: any = {};
  isWrong: boolean;

  constructor(private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService) {}

  ngOnInit() {
    if (this.authService.loggedIn) {
      const curentUser  = JSON.parse(localStorage.getItem("user"));
      // if( curentUser.role[0] == "agv") {
      //   this.router.navigate(["/scan/scan-agv"]);
      // }
      // else {
         this.router.navigate(["/dashboard"]);
      // }
    }
    this.isWrong = false;
  }

  login() {
    this.spinner.show();
    //console.log(this.user);
    this.authService.login(this.user).subscribe(
      next => {
      },
      error => {
        console.log("error: ", error)
        this.isWrong = true;
        this.spinner.hide();
      },
      () => {
        const curentUser  = JSON.parse(localStorage.getItem("user"));
        // if( curentUser.role[0] == "agv") {
        //   this.router.navigate(["/scan/scan-agv"]);
        // }
        // else {
           this.router.navigate(["/dashboard"]);
        // }
        this.spinner.hide();
      }
    );
  }
}
