import { Component } from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {Service} from "../../../lib/models/service/Service";



@Component({
    templateUrl: "service.html",
    providers: [Service]
})
export class ServiceComponent {
    displayedColumns = ["select", "id" , "name" , "action"];
    orderby:any = "name";
    desc:any = "asc";
    services:any = [];
    page:any = 0;
    total:any = 0;
    pager: any = 10;
    selection = new SelectionModel<any>(true, []);
    inLoad:any = false;
    search:string = "";

    constructor(public serviceModel:Service) {
        this.reload();
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.services.items.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.services.items.forEach(row => this.selection.select(row));
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
        this.serviceModel.getAll({
            order : this.orderby,
            desc : this.desc,
            page : this.page + 1,
            pager : this.pager,
            search: this.search
        }).then( response => {
            this.inLoad = false;
            this.services = response.result;
        });
    }


    public pageChanged(event: any): void {
        this.page = event.page;
        this.reload();
    }

    newService() {
        let category = prompt("Please enter category name :");
        if(category)
        {
            this.serviceModel.save({ name : category}).then(data => {
                this.refresh();
            });
        }
    }
    refresh(){
        this.page = 0;
        this.reload();
    }
    editItem(item)
    {
        let category = prompt("Please enter Country name :" , item.name);
        if(category)
        {
            this.serviceModel.save({id:item.id , name : category}).then(data => {
                this.refresh();
            });
        }
    }

    deleteItem(itemID)
    {
        if(confirm("Are you sure ?")){
            this.serviceModel.destroy(itemID).then( data => {
                this.refresh();
            });
        }
    }


}
