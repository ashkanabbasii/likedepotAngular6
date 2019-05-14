import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Ticket} from "../../../../lib/models/ticket/ticket";
import {Reply} from "../../../../lib/models/reply/reply";
import { ActivatedRoute } from '@angular/router';
import {BaseComponent} from "../../../../lib/services/BaseComponent";



@Component({

    templateUrl: "edit.html",
    providers: [Reply,Ticket]
})
export class TicketEditComponent extends BaseComponent{
    type: any = 'New';
    inLoad: boolean = false;
    replyForm: any = new FormGroup({
        'id': new FormControl(''),
        'user_id': new FormControl('', Validators.compose([Validators.required])),
        'ticket_id': new FormControl('', Validators.compose([Validators.required])),
        'reply': new FormControl('', Validators.compose([Validators.required]))
    });

    private sub: any;
    ticket:any;
    id: number;
    constructor(public replyModel: Reply,public ticketModel:Ticket,public route:ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {

            this.id = params['id']; // (+) converts string 'id' to a number
            if(this.id)
            {
                this.inLoad = true;
                this.ticketModel.get(this.id).then( data => {
                    this.inLoad = false;
                    if(!data.hasError)
                    {
                        this.ticket = data.result;
                        this.replyForm.controls['user_id'].setValue(this.ticket.user_id);
                        this.replyForm.controls['ticket_id'].setValue(this.ticket.id);

                    }
                });
            }

        });
    }

    submit() {
        this.inLoad = true;
        if (this.replyForm.valid) {
            this.inLoad = false;
            this.replyModel.save(this.replyForm.value).then(result => {

                if (!result.hasError) {
                    this.ticket.replies.push(result.result)
                }
            });
        }
    }
    ticketStatus(element,ev)
    {



        if(confirm("Are you sure you want to Change Status of this ticket?")){
            this.ticketModel.save({
                'id' : element.id,
                'status' : ev.value,
            }).then( data => {

                this.errorMessage('ticket status has changed','');
            });
        }
    }

}
