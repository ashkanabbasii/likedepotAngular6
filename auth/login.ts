import { Component } from '@angular/core';
import {LocalStorageService} from "ng2-webstorage";
import {Router} from "@angular/router";
import {Validators, FormControl, FormGroup} from "@angular/forms";
import {BaseComponent} from "../../lib/services/BaseComponent";
import {Auth} from "../../lib/services/Auth";
import {UserIdleService} from "angular-user-idle";



@Component({
    templateUrl: "login.html",
})
export class LoginComponent extends BaseComponent
{
    hide = true;
    submitted:boolean = false;
    breakpoint:any;
    loginForm: any = new FormGroup({
        'username': new FormControl('', Validators.compose([Validators.required])),
        'password': new FormControl('', Validators.compose([Validators.required , Validators.minLength(4)]))
    });

    constructor(public router:Router, private storage:LocalStorageService , public auth:Auth){
        super();
        this.breakpoint = (window.innerWidth <= 800) ? 1 : 3;
        if(this.storage.retrieve("user"))
        {
            this.router.navigate(['/dashboard']);
        }

    }


    login()
    {

        this.submitted = true;
        if(this.loginForm.valid)
        {
            this.error = "";
            this.showLoading();
            this.auth.authRequest(this.loginForm.value , "login").then(result => {
                this.hideLoading();
                if(!result.hasError)
                {
                    this.storage.store("user" , result.result.user);
                    this.storage.store("token" , result.result.token);
                    this.router.navigate(['/dashboard']);
                }
                else
                {
                    this.error = result.result;
                }
            });
        }

    }
}
