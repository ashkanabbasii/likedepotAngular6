import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LocalStorageService} from "ng2-webstorage";
import {Router} from "@angular/router";
import {BaseComponent} from "../../../lib/services/BaseComponent";
import {Auth} from "../../../lib/services/Auth";



@Component({
    templateUrl: "navbar.html",
    selector: 'main-navbar',
    providers : [Auth]
})
export class NavbarPartial extends BaseComponent
{
    @Input()
    user:any = {};

    @Output()
    redirected = new EventEmitter();

    userMenu:any = false;

    navPop:any = {
        userMenu :false
    };


    constructor(public storage:LocalStorageService , public router:Router , public auth:Auth){
        super();

        if(this.user = this.storage.retrieve("user"))
        {
            this.storage.observe("user").subscribe( value => {
                this.user = value;
            });
        }

    }

    logout()
    {
        this.auth.logoutRequest().then(data => {
            this.userMenu = false;
            this.storage.clear();
            this.router.navigate(["/login"]);
        });

    }

    closeNav()
    {
        this.redirected.emit(true);
    }

    onSelect(el){

    }
}
