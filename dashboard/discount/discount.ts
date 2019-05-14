import { Component } from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {MatDialog} from "@angular/material";
import {Discount} from "../../../lib/models/discount/discount";
import {DisCountEditComponent} from "./edit/edit";
import {BannerComponent} from "./banner/edit";



@Component({
    templateUrl: "discount.html",
    providers: [Discount]
})
export class DiscountComponent {
    displayedColumns = [ "select" , "id" , "source_id",'status','discount', "action"];
    orderby:any = "id";
    desc:any = "desc";
    discounts:any = [];
    page:any = 0;
    pager: any = 10;
    selection = new SelectionModel<any>(true, []);
    inLoad:any = false;
    search:string = "";

    constructor(public disCountModel:Discount, public dialog: MatDialog) {
        this.reload();
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.discounts.items.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.discounts.items.forEach(row => this.selection.select(row));
    }

    sortData(s) {
        this.desc = s.direction;
        this.orderby = s.active;
        this.page = 0;
        this.reload();
    }

    changePage(p) {
        this.pager = p.pageSize;
        this.page = p.pageIndex;
        this.reload();
    }

    reload()
    {
        this.inLoad = true;
        this.disCountModel.getAll({
            order : this.orderby,
            desc : this.desc,
            page : this.page + 1,
            pager : this.pager,
            search: this.search
        }).then( response => {
            this.inLoad = false;

            this.discounts = response.result;

        });
    }


    public pageChanged(event: any): void {
        this.page = event.page;
        this.reload();
    }

    refresh(){
        this.page = 0;
        this.reload();
    }


    deleteItem(itemID)
    {
        if(confirm("Are you sure ?")){
            this.disCountModel.destroy(itemID).then( data => {
                this.refresh();
            });
        }
    }

    editProduct(item) {
        const dialogRef = this.dialog.open(DisCountEditComponent, {
            height: '500px',
            width: '300px',
            data: {item: item},
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.reload();
            }
        });
    }
    uploadBanner() {
        const dialogRef = this.dialog.open(BannerComponent, {
            height: '500px',
            width: '300px',

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.reload();
            }
        });
    }
    expireBanner(){

        this.disCountModel.expireBanner().then(result=>{

            if (!result.hasError) {



            }

        })

    }
}
