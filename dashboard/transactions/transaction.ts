import { Component } from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {Transaction} from "../../../lib/models/transaction/transaction";



@Component({
    templateUrl: "transaction.html",
    providers: [Transaction]
})
export class TransactionComponent {
    displayedColumns = ["select",'id', "user" ,"type","ref_type" ,"ref_id","amount"];
    orderby:any = "id";
    desc:any = "desc";
    transaction:any = [];
    page:any = 0;
    total:any = 0;
    pager: any = 10;
    selection = new SelectionModel<any>(true, []);
    inLoad:any = false;
    search:string = "";

    constructor(public transactionModel:Transaction) {
        this.reload();
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.transaction.items.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.transaction.items.forEach(row => this.selection.select(row));
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
        this.transactionModel.getAll({
            order : this.orderby,
            desc : this.desc,
            page : this.page + 1,
            pager : this.pager,
            search: this.search
        }).then( response => {
            this.inLoad = false;
            this.transaction = response.result;
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



}
