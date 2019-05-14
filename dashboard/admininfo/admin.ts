import { Component } from '@angular/core';
import {User} from "../../../lib/models/user/User";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BaseComponent} from "../../../lib/services/BaseComponent";



@Component({
    templateUrl: "admin.html",
    providers: [User]
})
export class AdminComponent extends BaseComponent{
    hide:any;
    inLoad:any = false;
    search:string = "";
    changePassForm: any = new FormGroup({
        "old_password": new FormControl('', [Validators.required]),
        'new_password': new FormControl('', Validators.compose([Validators.required])),
        'confirmedPassword': new FormControl(null, [Validators.required ])
    });

        constructor(public userModel:User) {
            super();
        }



    changePass(){
        this.inLoad=true;

        if (this.changePassForm.valid && this.changePassForm.get('new_password').value === this.changePassForm.get('confirmedPassword').value) {

            this.inLoad = false;
            this.userModel.ChangePass(this.changePassForm.value).then(result => {


                if (!result.hasError) {
                    alert('Your Password changed');

                }
                else{

                    alert('Your Old Password is Wrong');
                }
            });
        }
        else {
            alert('Password is not match');
        }

    }


}
