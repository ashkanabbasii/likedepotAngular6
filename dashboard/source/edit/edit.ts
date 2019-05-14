import {Component, Inject, ViewChild} from '@angular/core';
import {Source} from "../../../../lib/models/source/Source";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GlobalVars} from "../../../../lib/services/GlobalVars";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";



@Component({
    templateUrl: "edit.html",
    providers: [Source]
})
export class SourceEditComponent {
    @ViewChild('fileInput') fileInput;
    img:any = "admin48/assets/img/placeholder.png";
    url:any = GlobalVars.BaseUrl;
    type:any = 'New';
    inLoad:boolean = false;
    sourceForm: any = new FormGroup({
        'id': new FormControl(''),
        'name': new FormControl('', Validators.compose([Validators.required])),

    });

    constructor(public sourceModel:Source,  public dialogRef: MatDialogRef<SourceEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        if(this.data.item && this.data.item.hasOwnProperty('id'))
        {
            this.type = 'Edit';
            for(var item in this.data.item)
            {
                if(this.sourceForm.controls.hasOwnProperty(item))
                {
                    this.sourceForm.controls[item].setValue(  this.data.item[item] );
                }
            }

            if(this.data.item.hasImg)
            {
                this.img = this.url + "/uploads/sources/" + this.data.item.id + ".jpg";
            }
        }
    }

    submit()
    {
        if(this.sourceForm.valid)
        {
            this.sourceModel.save(this.sourceForm.value).then( result => {

                if(!result.hasError)
                {
                    let fileBrowser = this.fileInput.nativeElement;
                    if (fileBrowser.files && fileBrowser.files[0]) {

                        const formData = new FormData();
                        formData.append("id", result.result);
                        formData.append("file", fileBrowser.files[0]);
                        this.inLoad = true;

                        this.sourceModel.postWithFormData(formData).then(response => {
                            this.inLoad = false;
                            this.dialogRef.close(true);
                        });
                    }
                    else{
                        this.dialogRef.close(true);
                    }
                }

            });
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
