import {Component, Inject, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {NewsLetter} from "../../../../lib/models/newsletter/NewsLetter";



@Component({
    templateUrl: "edit.html",
    providers: [NewsLetter]
})
export class NewsLetterEditComponnet {
    type: any = 'New';
    inLoad: boolean = false;
    newsLetterForm: any = new FormGroup({
        'id': new FormControl(''),
        'email': new FormControl('', Validators.compose([Validators.required])),
    });

    submitedItems: any = '';

    constructor(public newsLetterModel: NewsLetter, public dialogRef: MatDialogRef<NewsLetterEditComponnet>, @Inject(MAT_DIALOG_DATA) public data: any) {
        if (this.data.item && this.data.item.hasOwnProperty('id')) {
            this.type = 'Edit';
            for (var item in this.data.item) {
                if (this.newsLetterForm.controls.hasOwnProperty(item)) {
                    this.newsLetterForm.controls[item].setValue(this.data.item[item]);
                }
            }
        }


    }



    submit() {
        if (this.newsLetterForm.valid) {
            this.newsLetterModel.save(this.newsLetterForm.value).then(result => {

                if (!result.hasError) {

                    this.dialogRef.close(true);

                }

            });
        }
    }

}
