import { Component } from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {User} from "../../../lib/models/user/User";
import {MatDialog} from "@angular/material";
import {UserEditComponent} from "./edit/edit";



@Component({
    templateUrl: "users.html",
    providers: [User]
})
export class UsersComponent {
    displayedColumns = ["select",'id', "name" ,"type", "username","email" ,"wallet","status", "action"];
    orderby:any = "id";
    desc:any = "asc";
    users:any = [];
    page:any = 0;
    total:any = 0;
    pager: any = 10;
    selection = new SelectionModel<any>(true, []);
    inLoad:any = false;
    search:string = "";

    constructor(public userModel:User ,public dialog: MatDialog) {
        this.reload();
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.users.items.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.users.items.forEach(row => this.selection.select(row));
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
        this.userModel.getAll({
            order : this.orderby,
            desc : this.desc,
            page : this.page + 1,
            pager : this.pager,
            search: this.search
        }).then( response => {
            this.inLoad = false;
            this.users = response.result;
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
    editUser(item)
    {

        const dialogRef = this.dialog.open(UserEditComponent, {
            height: '500px',
            width: '500px',
            data: {item: item},
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.reload();
            }
        });
    }

    deleteItem(itemID)
    {
        if(confirm("Are you sure ?")){
            this.userModel.destroy(itemID).then( data => {
                this.refresh();
            });
        }
    }


}
