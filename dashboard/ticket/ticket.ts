import { Component } from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {Ticket} from "../../../lib/models/ticket/ticket";
import { ActivatedRoute } from '@angular/router';



@Component({
    templateUrl: "ticket.html",
    providers: [Ticket]
})
export class TicketComponenet {
    displayedColumns = ["select", "id", "user_id","subject"  , "status",'important' , "action"];
    orderby:any = "created_at";
    desc:any = "desc";
    tickets:any = [];
    page:any = 0;
    pager: any = 10;
    selection = new SelectionModel<any>(true, []);
    inLoad:any = false;
    search:string = "";

    constructor(public ticketModel:Ticket, public route: ActivatedRoute) {
        this.reload();
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.tickets.items.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.tickets.items.forEach(row => this.selection.select(row));
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
        this.ticketModel.getAll({
            order : this.orderby,
            desc : this.desc,
            page : this.page + 1,
            pager : this.pager,
            search: this.search
        }).then( response => {
            this.inLoad = false;
            this.tickets = response.result;
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
            this.ticketModel.destroy(itemID).then( data => {
                this.refresh();
            });
        }
    }


    closeTicket(element)
    {
        if(confirm("Are you sure you want to close this ticket?")){
            this.ticketModel.save({
                'id' : element.id,
                'status' : 1
            }).then( data => {
                this.refresh();
            });
        }
    }



}
