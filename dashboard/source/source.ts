import {Component, ViewChild} from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {Source} from "../../../lib/models/source/Source";
import {SourceEditComponent} from "./edit/edit";
import {MatDialog} from "@angular/material";
import {GlobalVars} from "../../../lib/services/GlobalVars";



@Component({
    templateUrl: "source.html",
    providers: [Source]
})
export class SourceComponent {
    img:any = "assets/img/placeholder.png";
    displayedColumns = ["select", 'pic',"id" , "name" , "action"];
    orderby:any = "name";
    desc:any = "asc";
    services:any = [];
    page:any = 0;
    pager: any = 10;
    selection = new SelectionModel<any>(true, []);
    inLoad:any = false;
    search:string = "";
    url:any = GlobalVars.BaseUrl;

    constructor(public sourceModel:Source, public dialog: MatDialog) {
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
        this.sourceModel.getAll({
            order : this.orderby,
            desc : this.desc,
            page : this.page + 1,
            pager : this.pager,
            search: this.search
        }).then( response => {
            this.inLoad = false;
            this.services = response.result;
            this.services.items.forEach(row => row.d = new Date().getTime().toString());

        });
    }

    refresh(){
        this.page = 0;
        this.reload();
    }


    deleteItem(itemID)
    {
        if(confirm("Are you sure ?")){
            this.sourceModel.destroy(itemID).then( data => {
                this.refresh();
            });
        }
    }


    editSource(item) {
        const dialogRef = this.dialog.open(SourceEditComponent, {
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


}
