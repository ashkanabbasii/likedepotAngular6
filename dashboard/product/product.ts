import { Component } from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {Product} from "../../../lib/models/product/Product";
import {MatDialog} from "@angular/material";
import {ProductEditComponent} from "./edit/edit";



@Component({
    templateUrl: "product.html",
    providers: [Product]
})
export class ProductComponent {
    displayedColumns = [ "select" , "id" , "source_id", "service_id" , "cat_id" , "quantity" , "price",'gender','gender_percent' , "action"];
    orderby:any = "created_at";
    desc:any = "desc";
    products:any = [];
    page:any = 0;
    pager: any = 10;
    selection = new SelectionModel<any>(true, []);
    inLoad:any = false;
    search:string = "";

    constructor(public productModel:Product, public dialog: MatDialog) {
        this.reload();
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.products.items.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.products.items.forEach(row => this.selection.select(row));
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
        this.productModel.getAll({
            order : this.orderby,
            desc : this.desc,
            page : this.page + 1,
            pager : this.pager,
            search: this.search
        }).then( response => {
            this.inLoad = false;
            this.products = response.result;

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
            this.productModel.destroy(itemID).then( data => {
                this.refresh();
            });
        }
    }

    editProduct(item) {
        const dialogRef = this.dialog.open(ProductEditComponent, {
            height: '500px',
            width: '300px',
            data: {item: item},
        });
        console.log(item);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.reload();
            }
        });
    }

}
