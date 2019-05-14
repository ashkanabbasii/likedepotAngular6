import { Component } from '@angular/core';
import {Order} from "../../../lib/models/order/Order";
import {Ticket} from "../../../lib/models/ticket/ticket";
import {Transaction} from "../../../lib/models/transaction/transaction";
import {SelectionModel} from "@angular/cdk/collections";



@Component({
    templateUrl: "home.html",
    providers: [Order,Ticket,Transaction]

})
export class HomeComponent {

    displayedColumnsOrder = ["select", "id", "user_id" , "ref_id" , "price",'status' ,'link', "action"];
    displayedColumnsTicket = ["select", "id", "user_id","subject"  , "status" , "action"];
    displayedColumnsTransaction = ["select",'id', "user" ,"type","ref_type" ,"ref_id","amount"];
    inLoad:any = false;
    users:any=0;
    products:any=0;
    orderbyTicket:any = "status";
    descTicket:any = "desc";
    orderbyOrder:any = "status";
    descOrder:any = "desc";
    orderbyTransaction:any = "created_at";
    descTransaction:any = "desc";
    transaction:any = [];
    order:any = [];
    ticket:any = [];
    total:any = 0;
    pageTicket:any = 0;
    pagerTicket: any = 10;
    pageOrder:any = 0;
    pagerOrder: any = 10;
    pageTransaction:any = 0;
    pagerTransaction: any = 10;
    selectionTicket = new SelectionModel<any>(true, []);
    selectionOrder = new SelectionModel<any>(true, []);
    selectionTransaction = new SelectionModel<any>(true, []);
    search:string = "";
    constructor(public ticketModel:Ticket , public orderModel:Order, public transactionModel:Transaction) {

        this.reload();

    }

    isAllSelected(table) {
        if (table == 'ticket'){
            const numSelected = this.selectionTicket.selected.length;
            const numRows = this.ticket.items.length;
            return numSelected === numRows;
        }
        if (table == 'order'){
            const numSelected = this.selectionOrder.selected.length;
            const numRows = this.order.items.length;
            return numSelected === numRows;
        }

        if (table == 'transaction'){
            const numSelected = this.selectionTransaction.selected.length;
            const numRows = this.transaction.items.length;
            return numSelected === numRows;
        }

    }

    masterToggle(table) {
        this.isAllSelected(table) ?
             this.changeSelection(table).clear() :
             this.toggleConfig(table).items.forEach(row =>  this.changeSelection(table).select(row));
    }

    toggleConfig(obj){
        if(obj =='ticket'){

            return this.ticket;
        }
        if(obj =='order'){

            return this.order;

        }
        if(obj =='transaction'){

            return this.transaction;

        }
    }
    changeSelection(table){

        if(table =='ticket'){

            return this.selectionTicket;
        }
        if(table =='order'){

            return this.selectionOrder;

        }
        if(table =='transaction'){

            return this.selectionTransaction;

        }


    }

    sortData(s,table) {

        if(table == 'ticket'){
            this.descTicket = s.direction;
            this.orderbyTicket = s.active;
            this.pageTicket = 0;
        }
        if(table == 'transaction'){
            this.descTransaction = s.direction;
            this.orderbyTransaction = s.active;
            this.pageTransaction = 0;
        }
        if(table == 'order'){
            this.descOrder = s.direction;
            this.orderbyOrder = s.active;
            this.pageOrder = 0;
        }
        this.reload();
    }

    changePage(p,table) {

        if (table == 'transaction'){
            this.pagerTransaction = p.pageSize;
            this.pageTransaction = p.pageIndex;
        }
        if (table == 'order'){
            this.pagerOrder = p.pageSize;
            this.pageOrder = p.pageIndex;
        }
        if(table == 'ticket'){
            this.pagerTicket = p.pageSize;
            this.pageTicket = p.pageIndex;
        }

        this.reload();
    }

    reload()
    {
        this.inLoad = true;
        this.ticketModel.pendingTicket({
            order : this.orderbyTicket,
            desc : this.descTicket,
            page : this.pageTicket + 1,
            pager : this.pagerTicket

        }).then( response => {
            this.inLoad = false;
            this.ticket = response.result;
        });
        this.orderModel.pendingOrder({
            order : this.orderbyOrder,
            desc : this.descOrder,
            page : this.pageOrder + 1,
            pager : this.pagerOrder

        }).then( response => {
            this.inLoad = false;
            this.order = response.result;
        });
        this.transactionModel.getAll({
            order : this.orderbyTransaction,
            desc : this.descTransaction,
            page : this.pageTransaction + 1,
            pager : this.pagerTransaction

        }).then( response => {
            this.inLoad = false;
            this.transaction = response.result;
        });
    }




    refresh(){
        this.pageTransaction = 0;
        this.pageOrder = 0;
        this.pageTicket = 0;
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
}
