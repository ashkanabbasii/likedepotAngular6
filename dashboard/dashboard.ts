import { Component } from '@angular/core';
import {LocalStorageService} from "ng2-webstorage";
import {ActivatedRoute, Router} from "@angular/router";
import {Auth} from '../../lib/services/Auth';
import {UserIdleService} from "angular-user-idle";

@Component({
    templateUrl: "dashboard.html",
    styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
    user: any = {};
    hideMenu:boolean = false;
    navTitle :any;
    constructor(public router: Router, public storage: LocalStorageService , public auth:Auth , route:ActivatedRoute,private userIdle: UserIdleService) {

        route.url.subscribe(() => {
            this.navTitle =  route.snapshot.firstChild.data.title;

        });
        if (this.user = this.storage.retrieve("user")) {
            this.storage.observe("user").subscribe(value => {
                this.user = value;
            });
        }
        else {
            this.router.navigate(["/login"]);
        }

    }
    ngOnInit() {
        //Start watching for user inactivity.
        this.userIdle.startWatching();

        // Start watching when user idle is starting.
        this.userIdle.onTimerStart().subscribe(count => console.log(count));
        // Start watch when time is up.
        this.userIdle.onTimeout().subscribe(() => {
            this.auth.logoutRequest().then(data => {
                this.storage.clear();
                this.router.navigate(["/login"]);
            });
        });
    }
    toggle()
    {
       this.hideMenu = !this.hideMenu
    }

    logOut()
    {
       this.auth.logoutRequest().then( res =>{
           this.storage.clear();
           this.router.navigate(["/login"]);
       });
    }
}
