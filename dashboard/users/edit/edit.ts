import {Component, Inject, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {User} from "../../../../lib/models/user/User";



@Component({
    templateUrl: "edit.html",
    providers: [User]
})
export class UserEditComponent {
    type: any = 'Edit';
    inLoad: boolean = false;
    userForm: any = new FormGroup({
        'id': new FormControl(''),
        'name': new FormControl('', Validators.compose([Validators.required])),
        'username': new FormControl('', Validators.compose([Validators.required])),
        'wallet': new FormControl('', Validators.compose([Validators.required])),
        'email': new FormControl('', Validators.compose([Validators.required])),
        'status': new FormControl('', Validators.compose([Validators.required])),
        'type': new FormControl('', Validators.compose([Validators.required])),

    });

    submitedItems: any = '';

    constructor(public userModel: User, public dialogRef: MatDialogRef<UserEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        if (this.data.item && this.data.item.hasOwnProperty('id')) {
            for (var item in this.data.item) {
                if (this.userForm.controls.hasOwnProperty(item)) {
                    this.userForm.controls[item].setValue(this.data.item[item]);
                }
            }
        }

        this.loadData();
    }

    loadData() {
        this.inLoad = true;
        this.userModel.get(this.data.item.id).then(items => {
            this.inLoad = false;
            if (!items.hasError) {
                this.submitedItems = items.result;
            }
        });
    }

    submit() {
        if (this.userForm.valid) {
            this.userModel.save(this.userForm.value).then(result => {

                if (!result.hasError) {

                    this.dialogRef.close(true);

                }

            });
        }
    }

}
