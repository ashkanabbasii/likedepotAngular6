import { Component } from '@angular/core';
import {Category} from "../../../lib/models/category/Category";
import {SelectionModel} from "@angular/cdk/collections";



@Component({
    templateUrl: "category.html",
    providers: [Category]
})
export class CategoryComponent {
    displayedColumns = ["select", "id" , "name" , "action"];
    orderby:any = "name";
    desc:any = "asc";
    categories:any = [];
    page:any = 0;
    total:any = 0;
    pager: any = 10;
    selection = new SelectionModel<any>(true, []);
    inLoad:any = false;
    search:string = "";

    constructor(public categoryModel:Category) {
        this.reload();
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.categories.items.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.categories.items.forEach(row => this.selection.select(row));
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
        this.categoryModel.getAll({
            order : this.orderby,
            desc : this.desc,
            page : this.page + 1,
            pager : this.pager,
            search: this.search
        }).then( response => {
            this.inLoad = false;
            this.categories = response.result;
        });
    }


    public pageChanged(event: any): void {
        this.page = event.page;
        this.reload();
    }

    newCategory() {
        let category = prompt("Please enter category name :");
        if(category)
        {
            this.categoryModel.save({ name : category}).then(data => {
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
        let category = prompt("Please enter category name :" , item.name);
        if(category)
        {
            this.categoryModel.save({id:item.id , name : category}).then(data => {
                this.refresh();
            });
        }
    }

    deleteItem(itemID)
    {
        if(confirm("Are you sure ?")){
            this.categoryModel.destroy(itemID).then( data => {
                this.refresh();
            });
        }
    }


}
