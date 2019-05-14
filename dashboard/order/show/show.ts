import {Component, Inject, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Product} from "../../../../lib/models/product/Product";



@Component({
    templateUrl: "show.html",
    providers: [Product]
})
export class ShowProductComponent {
   inLoad = false;

   product:any = [];

    constructor(public productModel: Product, public dialogRef: MatDialogRef<ShowProductComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {


        this.productModel.get(data.item.product_id).then(ress=>{

         if (!ress.hasError) {

            this.product = ress.result;

         }

        })



    }





}
