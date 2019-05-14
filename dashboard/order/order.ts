import { Component } from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import { ActivatedRoute } from '@angular/router';
import {Order} from "../../../lib/models/order/Order";
import {MatDialog} from "@angular/material";
import {ShowProductComponent} from "./show/show";



@Component({
    templateUrl: "order.html",
    providers: [Order]
})
export class OrderComponent {
    displayedColumns = ["select", "id",'product_id', "user_id" , "ref_id",'gender' , "price",'status' ,'link', "action"];
    orderby:any = "created_at";
    desc:any = "desc";
    orders:any = [];
    page:any = 0;
    pager: any = 10;
    selection = new SelectionModel<any>(true, []);
    inLoad:any = false;
    search:string = "";

    constructor(public orderModel:Order, public route: ActivatedRoute,public dialog: MatDialog) {
        this.reload();
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.orders.items.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.orders.items.forEach(row => this.selection.select(row));
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
        this.orderModel.getAll({
            order : this.orderby,
            desc : this.desc,
            page : this.page + 1,
            pager : this.pager,
            search: this.search
        }).then( response => {
            this.inLoad = false;
            this.orders = response.result;
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


    ChangeStatus(item)
    {

        if(confirm("Are you sure ?")){
            this.orderModel.save({id:item.id , status : item.status}).then( data => {
                this.refresh();
            });
        }
    }

    showProduct(item){

        const dialogRef = this.dialog.open(ShowProductComponent, {
            height: '500px',
            width: '300px',
            data: {item: item},
        });

    }

}
