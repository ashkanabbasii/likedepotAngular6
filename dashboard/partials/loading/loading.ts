import {Component, Input} from '@angular/core';

@Component({
    templateUrl: "loading.html",
    selector: 'loading',
})
export class LoadingPartials
{
    @Input()
    inLoad:any = {};
    constructor(){}

}
