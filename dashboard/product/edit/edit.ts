import {Component, Inject, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Product} from "../../../../lib/models/product/Product";



@Component({
    templateUrl: "edit.html",
    providers: [Product]
})
export class ProductEditComponent {
    type: any = 'New';
    inLoad: boolean = false;
    productForm: any = new FormGroup({
        'id': new FormControl(''),
        'cat_id': new FormControl('', Validators.compose([Validators.required])),
        'source_id': new FormControl('', Validators.compose([Validators.required])),
        'gender': new FormControl(''),
        'gender_percent':  new FormControl('', Validators.compose([Validators.required])),
        'service_id': new FormControl('', Validators.compose([Validators.required])),
        'quantity': new FormControl('', Validators.compose([Validators.required])),
        'price': new FormControl('', Validators.compose([Validators.required])),
        'description': new FormControl('', Validators.compose([Validators.required])),
    });

    submitedItems: any = '';

    constructor(public productModel: Product, public dialogRef: MatDialogRef<ProductEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        if (this.data.item && this.data.item.hasOwnProperty('id')) {
            this.type = 'Edit';
            for (var item in this.data.item) {
                if (this.productForm.controls.hasOwnProperty(item)) {
                    this.productForm.controls[item].setValue(this.data.item[item]);
                }
            }
        }

        this.loadData();
    }

    loadData() {
        this.inLoad = true;
        this.productModel.getProductSubmitItems().then(items => {
            this.inLoad = false;
            if (!items.hasError) {
                this.submitedItems = items.result;
            }
        });
    }

    submit() {
        if (this.productForm.valid) {
            this.productModel.save(this.productForm.value).then(result => {

                if (!result.hasError) {

                    this.dialogRef.close(true);

                }

            });
        }
    }

}
