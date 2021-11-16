import { INavData } from '@coreui/angular';
import { Injectable } from "@angular/core";



export const navItems: INavData[] = [
  {
    name: '0. Settings',
    url: '/',
    icon: 'icon-wrench',
    children: [
      {
        name: '0.1 User',
        url: '/settings/users',
        class: "menu-margin"
      },
    ]
  },
  {
    name: '1. Maintain',
    url: '/',
    icon: 'icon-note',
    children: [
      {
        name: '1.1 Upload',
        url: '/applicants/upload',
        class: "menu-margin"
      },
    ]
  },
  {
    name: '2. Transaction',
    url: '/',
    icon: 'icon-grid',
    children: [
      {
        name: '2.1 Applicants',
        url: '/applicants',
        class: "menu-margin"
      },
    ]
  },
  {
    name: '3. Kanban',
    url: '/',
    icon: 'icon-chart',
    children: [
    ]
  },
  {
    name: '4. Report',
    url: '/',
    icon: 'icon-docs',
    children: [
    ]
  },
  {
    name: '5. Query',
    url: '/',
    icon: 'icon-magnifier',
    children: [
    ]
  },
];

@Injectable({
  providedIn: "root", // <- ADD THIS
})

export class NavItem {
  navItems: INavData[] = [];
  hasSettings: boolean;

  constructor() {}
  getNav(user: any) {

    this.navItems = [];
    this.hasSettings = false;

    if( user == null) return [    ];

    const navItemSettings = {
      name: '0. Settings',
      url: '/settings',
      icon: 'icon-wrench',
      children: [],
    };

    const navItemMaintain = {
      name: '1. Maintain',
      url: '/maintain',
      icon: 'icon-note',
      children: [],
    };

    const navItemTransaction = {
      name: '2. Transaction',
      url: '/transaction',
      icon: 'icon-grid',
      children: [],
    };

    const navItemKanban = {
      name: '3. Kanban',
      url: '/kanban',
      icon: 'icon-chart',
      children: [],
    };

    const navItemReport = {
      name: '4. Report',
      url: '/report',
      icon: 'icon-docs',
      children: [],
    };

    const navItemQuery = {
      name: '5. Query',
      url: '/query',
      icon: 'icon-magnifier',
      children: [],
    };

    if(user != null) {
      user.role.forEach((element) => {
        if (element === "admin") {
          this.hasSettings = true;
          const children01 = {
            name: '0.1 User',
            url: '/settings/users',
            class: "menu-margin"
          };
          navItemSettings.children.push(children01);
        }
        if (element === "UploadApplicant") {
          const children11 = {
            name: '1.1 Upload',
            url: '/applicants/upload',
            class: "menu-margin"
          };
          navItemMaintain.children.push(children11);
        }

        if (element === "SearchApplicant") {
          const children21 = {
            name: '2.1 Applicants',
            url: '/applicants',
            class: "menu-margin"
          };
          navItemTransaction.children.push(children21);
        }
      })
    }
    if(this.hasSettings){
      this.navItems.push(navItemSettings);
    }
    this.navItems.push(navItemMaintain);
    this.navItems.push(navItemTransaction);
    this.navItems.push(navItemKanban);
    this.navItems.push(navItemReport);
    this.navItems.push(navItemQuery);

    return this.navItems;
  }
}




  /*
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Theme'
  },
  {
    name: 'Colors',
    url: '/theme/colors',
    icon: 'icon-drop'
  },
  {
    name: 'Typography',
    url: '/theme/typography',
    icon: 'icon-pencil'
  },
  {
    title: true,
    name: 'Components'
  },
  {
    name: 'Base',
    url: '/base',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Cards',
        url: '/base/cards',
        icon: 'icon-puzzle'
      },
      {
        name: 'Carousels',
        url: '/base/carousels',
        icon: 'icon-puzzle'
      },
      {
        name: 'Collapses',
        url: '/base/collapses',
        icon: 'icon-puzzle'
      },
      {
        name: 'Forms',
        url: '/base/forms',
        icon: 'icon-puzzle'
      },
      {
        name: 'Navbars',
        url: '/base/navbars',
        icon: 'icon-puzzle'

      },
      {
        name: 'Pagination',
        url: '/base/paginations',
        icon: 'icon-puzzle'
      },
      {
        name: 'Popovers',
        url: '/base/popovers',
        icon: 'icon-puzzle'
      },
      {
        name: 'Progress',
        url: '/base/progress',
        icon: 'icon-puzzle'
      },
      {
        name: 'Switches',
        url: '/base/switches',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tables',
        url: '/base/tables',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tabs',
        url: '/base/tabs',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tooltips',
        url: '/base/tooltips',
        icon: 'icon-puzzle'
      }
    ]
  },
  {
    name: 'Buttons',
    url: '/buttons',
    icon: 'icon-cursor',
    children: [
      {
        name: 'Buttons',
        url: '/buttons/buttons',
        icon: 'icon-cursor'
      },
      {
        name: 'Dropdowns',
        url: '/buttons/dropdowns',
        icon: 'icon-cursor'
      },
      {
        name: 'Brand Buttons',
        url: '/buttons/brand-buttons',
        icon: 'icon-cursor'
      }
    ]
  },
  {
    name: 'Charts',
    url: '/charts',
    icon: 'icon-pie-chart'
  },
  {
    name: 'Icons',
    url: '/icons',
    icon: 'icon-star',
    children: [
      {
        name: 'CoreUI Icons',
        url: '/icons/coreui-icons',
        icon: 'icon-star',
        badge: {
          variant: 'success',
          text: 'NEW'
        }
      },
      {
        name: 'Flags',
        url: '/icons/flags',
        icon: 'icon-star'
      },
      {
        name: 'Font Awesome',
        url: '/icons/font-awesome',
        icon: 'icon-star',
        badge: {
          variant: 'secondary',
          text: '4.7'
        }
      },
      {
        name: 'Simple Line Icons',
        url: '/icons/simple-line-icons',
        icon: 'icon-star'
      }
    ]
  },
  {
    name: 'Notifications',
    url: '/notifications',
    icon: 'icon-bell',
    children: [
      {
        name: 'Alerts',
        url: '/notifications/alerts',
        icon: 'icon-bell'
      },
      {
        name: 'Badges',
        url: '/notifications/badges',
        icon: 'icon-bell'
      },
      {
        name: 'Modals',
        url: '/notifications/modals',
        icon: 'icon-bell'
      }
    ]
  },
  {
    name: 'Widgets',
    url: '/widgets',
    icon: 'icon-calculator',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    divider: true
  },
  {
    title: true,
    name: 'Extras',
  },
  {
    name: 'Pages',
    url: '/pages',
    icon: 'icon-star',
    children: [
      {
        name: 'Login',
        url: '/login',
        icon: 'icon-star'
      },
      {
        name: 'Register',
        url: '/register',
        icon: 'icon-star'
      },
      {
        name: 'Error 404',
        url: '/404',
        icon: 'icon-star'
      },
      {
        name: 'Error 500',
        url: '/500',
        icon: 'icon-star'
      }
    ]
  },
  {
    name: 'Disabled',
    url: '/dashboard',
    icon: 'icon-ban',
    badge: {
      variant: 'secondary',
      text: 'NEW'
    },
    attributes: { disabled: true },
  },
  {
    name: 'Download CoreUI',
    url: 'http://coreui.io/angular/',
    icon: 'icon-cloud-download',
    class: 'mt-auto',
    variant: 'success',
    attributes: { target: '_blank', rel: 'noopener' }
  },
  {
    name: 'Try CoreUI PRO',
    url: 'http://coreui.io/pro/angular/',
    icon: 'icon-layers',
    variant: 'danger',
    attributes: { target: '_blank', rel: 'noopener' }
  } */

