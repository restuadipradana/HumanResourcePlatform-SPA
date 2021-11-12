import { HUserLogged } from './../../../core/_models/h-user-logged';
import { TRole } from './../../../core/_models/t-role';
import { HRoleByUser } from './../../../core/_models/h-role-by-user';
import { UserService } from './../../../core/_services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-user-authorization',
  templateUrl: './user-authorization.component.html',
  styleUrls: ['./user-authorization.component.scss']
})
export class UserAuthorizationComponent implements OnInit {

  reuslt: any = {};
  listsUser: HUserLogged[];
  roles: TRole[];
  userDetail: HUserLogged = { account: '', role: [], name: '' };
  listRoleByUser: HRoleByUser[] = [];
  userAuthorizationAccount: string = '';
  userAuthorizationName: string = '';
  acc: string;
  btnSave: boolean;



  @ViewChild('createModal') public createModal: ModalDirective;
  @ViewChild('editModal') public editModal: ModalDirective;

  constructor(private _userSvc: UserService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getListUser();
  }

  getListUser(){
    this.spinner.show();
    this._userSvc.getAllUser().subscribe(
      (res: any) => {
        this.reuslt = res;
        this.listsUser = this.reuslt.lists;
        this.roles = this.reuslt.roles;
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  getUserDetail(account: string, name: string){
    this.userAuthorizationAccount = account;
    this.userAuthorizationName = name;
    this._userSvc.getRoleByUser(this.userAuthorizationAccount).subscribe(
      res => {
        this.listRoleByUser = res;
        this.editModal.show();
      }
    );
  }

  saveAuthorizationUser() {
    const updateRoleByUser = this.listRoleByUser.filter(item => {
      return item.status === true;
    });
    this._userSvc.updateRoleByUser(this.userAuthorizationAccount, updateRoleByUser)
    .subscribe(() => {
      this.editModal.hide();
      this.createModal.hide();
      this.getListUser();
    }, error => {
    });
  }

  openModalAdd(){
    this._userSvc.getRoleByUser("x").subscribe(
      res => {
        this.listRoleByUser = res;
        this.userAuthorizationAccount = "";
        this.createModal.show();
      }
    );
  }

  checkUser(){
    this._userSvc.checkUser(this.userAuthorizationAccount).subscribe(
      (res: boolean) => {
        this.btnSave = res;
      },
      (error) => {
        console.log("Error: " , error.error);
      }
    );
  }

}
