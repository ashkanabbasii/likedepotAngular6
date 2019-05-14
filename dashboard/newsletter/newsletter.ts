import {Component, ViewChild} from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import { ActivatedRoute } from '@angular/router';
import {NewsLetter} from "../../../lib/models/newsletter/NewsLetter";
import {saveAs as importedSaveAs} from "file-saver";
import {ProductEditComponent} from "../product/edit/edit";
import {MatDialog} from "@angular/material";
import {NewsLetterEditComponnet} from "./edit/edit";


@Component({
    templateUrl: "newsletter.html",
    providers: [NewsLetter]
})
export class NewsletterComponent {
    @ViewChild('link') link;
    displayedColumns = ["select", "id",'email','action'];
    orderby:any = "id";
    desc:any = "desc";
    newsletters:any = [];
    page:any = 0;
    pager: any = 10;
    selection = new SelectionModel<any>(true, []);
    inLoad:any = false;
    search:string = "";

    constructor(public newsLetterModel:NewsLetter, public route: ActivatedRoute,public dialog: MatDialog) {
        this.reload();
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.newsletters.items.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.newsletters.items.forEach(row => this.selection.select(row));
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
        this.newsLetterModel.getAll({
            order : this.orderby,
            desc : this.desc,
            page : this.page + 1,
            pager : this.pager,
            search: this.search
        }).then( response => {
            this.inLoad = false;
            this.newsletters = response.result;
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


    download(){

        this.newsLetterModel.getCSV({

        }).then( data => {

            let blob = new Blob([data], { type: 'text/csv' });
            importedSaveAs(blob, 'newsletter.csv');
        });
    }
    editProduct(item) {
        const dialogRef = this.dialog.open(NewsLetterEditComponnet, {
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
    deleteItem(itemID)
    {
        if(confirm("Are you sure ?")){
            this.newsLetterModel.destroy(itemID).then( data => {
                this.refresh();
            });
        }
    }
}
