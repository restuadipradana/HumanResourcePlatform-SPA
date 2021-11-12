import {Component} from '@angular/core';
import { NavItem } from '../../_nav';
import { AuthService } from '../../core/_services/auth.service';
import { UserService } from '../../core/_services/user.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = [];
  currentUser: any = JSON.parse(localStorage.getItem('user'));

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  constructor(private authService: AuthService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private userService: UserService,
    private nav: NavItem) {
      this.navItems = this.nav.getNav(this.currentUser); //ke nav_
    }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.router.navigate(['/login']);
  }
}
