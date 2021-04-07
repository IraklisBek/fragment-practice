import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

interface menuItem {
  name: string;
  link: string;
  icon: string;
  iconActive: string;
}

@Component({
  selector: 'app-bottom-menu',
  templateUrl: './bottom-menu.component.html',
  styleUrls: ['./bottom-menu.component.scss']
})


export class BottomMenuComponent implements OnInit {

  menuItems: menuItem[] = []
  route: string = "";
  isOpenNotificationPanel: boolean = false;

  constructor(
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.menuItems.push(
      {
        name: "home",
        link: "/home",
        icon: "home.png",
        iconActive: "home-active.png"
      },
      {
        name: "create",
        link: "/create",
        icon: "create.png",
        iconActive: "create-active.png"
      },
      {
        name: "search",
        link: "/search",
        icon: "search.png",
        iconActive: "search-active.png"
      },
      {
        name: "notification",
        link: "/notifications",
        icon: "notification.png",
        iconActive: "notification-active.png"
      },
      {
        name: "burger",
        link: "/burger",
        icon: "burger.png",
        iconActive: "burger-active.png"
      }
    )
    this.router.events.subscribe(val => {
      if (this.route.indexOf("?") > 0) {
        this.route = this.location.path().substr(0, this.route.indexOf("?"))
      }else{
        this.route = this.location.path()
      }
    })
  }

  getRouterStringWithoutParams() {

  }
  goto(route: string) {
    if (route.indexOf("notification") < 0) {
      (<HTMLImageElement>document.getElementById("bottom_menu_img_notification"))!.src = "../../../assets/icons/notification.png";
      (<HTMLImageElement>document.getElementById("notificationPanel")).style.display = "none";
      this.isOpenNotificationPanel = false;
      this.router.navigate([route]);

    } else {
      for (let menuItem of this.menuItems) {
        if (menuItem.name == "notification") {
          if (!this.isOpenNotificationPanel) {
            (<HTMLElement>document.getElementById("notificationPanel")).style.display = "block";
            //(<HTMLImageElement>document.getElementById("bottom_menu_img_" + menuItem.name))!.src = "../../../assets/icons/" + menuItem.iconActive;
          } else {
            (<HTMLImageElement>document.getElementById("notificationPanel")).style.display = "none";
            //(<HTMLImageElement>document.getElementById("bottom_menu_img_" + menuItem.name))!.src = "../../../assets/icons/" + menuItem.icon;
          }
          this.isOpenNotificationPanel = !this.isOpenNotificationPanel;
        }
      }
    }
  }
}
