import {Component, Inject, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Discount} from "../../../../lib/models/discount/discount";



@Component({
    templateUrl: "edit.html",
    providers: [Discount]
})
export class DisCountEditComponent {
    type: any = 'New';
    inLoad: boolean = false;
    discountForm: any = new FormGroup({
        'id': new FormControl(''),
        'discount': new FormControl('', Validators.compose([Validators.required])),
        'source_id': new FormControl('', Validators.compose([Validators.required])),
        'status': new FormControl('', Validators.compose([Validators.required])),

    });

    submitedItems: any  = '';

    constructor(public disCountModel: Discount, public dialogRef: MatDialogRef<DisCountEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        if (this.data.item && this.data.item.hasOwnProperty('id')) {
            this.type = 'Edit';

            for (var item in this.data.item) {
                if (this.discountForm.controls.hasOwnProperty(item)) {
                    this.discountForm.controls[item].setValue(this.data.item[item]);
                }
            }
        }

        this.loadData();
    }

    loadData() {
        this.inLoad = true;
        this.disCountModel.getDiscountInfo().then(items => {
            this.inLoad = false;
            if (!items.hasError) {
                this.submitedItems = items.result;

            }
        });
    }

    submit() {
        if (this.discountForm.valid) {
            this.disCountModel.save(this.discountForm.value).then(result => {

                if (!result.hasError) {

                    this.dialogRef.close(true);

                }

            });
        }
    }

}
