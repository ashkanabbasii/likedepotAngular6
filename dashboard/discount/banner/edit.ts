import {Component, Inject, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Discount} from "../../../../lib/models/discount/discount";
import {GlobalVars} from "../../../../lib/services/GlobalVars";



@Component({
    templateUrl: "edit.html",
    providers: [Discount]
})
export class BannerComponent {
    type: any = 'New';
    inLoad: boolean = false;
    @ViewChild('fileInput') fileInput;
    img:any = "admin48/assets/img/placeholder.png";
    url:any = GlobalVars.BaseUrl;

    submitedItems: any  = '';

    constructor(public disCountModel: Discount, public dialogRef: MatDialogRef<BannerComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {


        this.loadData();
    }

    loadData() {

    }

    submit()
    {

        let fileBrowser = this.fileInput.nativeElement;
        if (fileBrowser.files && fileBrowser.files[0]) {

            const formData = new FormData();
            formData.append("file", fileBrowser.files[0]);
            this.inLoad = true;

            this.disCountModel.postWithFormData(formData).then(response => {
                this.inLoad = false;
                this.dialogRef.close(true);
            });
        }
        else{
            this.dialogRef.close(true);
        }



    }

    upload()
    {
        let input = this.fileInput.nativeElement;

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload =  (e:any) => {
                this.img = e.target.result;
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

}
