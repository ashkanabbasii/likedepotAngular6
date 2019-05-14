import { Component } from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {MatDialog} from "@angular/material";
import {BlogEditComponent} from "./edit/edit";
import {Blog} from "../../../lib/models/blog/blog";



@Component({
    templateUrl: "blog.html",
    providers: [Blog]
})
export class BlogComponent {
    displayedColumns = [ "select" , "id" , "title", "blog_body" , "status"  , "action"];
    orderby:any = "created_at";
    desc:any = "desc";
    news:any = [];
    page:any = 0;
    pager: any = 10;
    selection = new SelectionModel<any>(true, []);
    inLoad:any = false;
    search:string = "";

    constructor(public blogModel:Blog, public dialog: MatDialog) {
        this.reload();
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.news.items.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.news.items.forEach(row => this.selection.select(row));
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
        this.blogModel.getAll({
            order : this.orderby,
            desc : this.desc,
            page : this.page + 1,
            pager : this.pager,
            search: this.search
        }).then( response => {
            this.inLoad = false;
            this.news = response.result;

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
            this.blogModel.destroy(itemID).then( data => {
                this.refresh();
            });
        }
    }

    editProduct(item) {

        const dialogRef = this.dialog.open(BlogEditComponent, {
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

}
