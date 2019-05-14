import {Component, Inject, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Blog} from "../../../../lib/models/blog/blog";



@Component({
    templateUrl: "edit.html",
    providers: [Blog]
})
export class BlogEditComponent {
    type: any = 'New';
    inLoad: boolean = false;
    blogForm: any = new FormGroup({
        'id': new FormControl(''),
        'status': new FormControl('', Validators.compose([Validators.required])),
        'title': new FormControl('', Validators.compose([Validators.required])),
        'blog_body': new FormControl('', Validators.compose([Validators.required])),

    });


    constructor(public blogModel: Blog, public dialogRef: MatDialogRef<BlogEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        if (this.data.item && this.data.item.hasOwnProperty('id')) {
            this.type = 'Edit';
            for (var item in this.data.item) {
                if (this.blogForm.controls.hasOwnProperty(item)) {
                    this.blogForm.controls[item].setValue(this.data.item[item]);
                }
            }
        }


    }


    submit() {
        if (this.blogForm.valid) {
            this.blogModel.save(this.blogForm.value).then(result => {

                if (!result.hasError) {

                    this.dialogRef.close(true);

                }

            });
        }
    }

}
