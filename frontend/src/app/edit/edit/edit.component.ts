import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import { EditService } from '../edit.service';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Bot} from '../../models/bot.model';
import * as uikit from 'uikit';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {
  editBotForm: FormGroup;
  botModel = new Bot();
  private bots: any;
  botIdFromUrl: number;
  botIdFromDropDown: number;
  bot: any;
  public successUserMessage: string;
  public errorUserMessage: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private editService: EditService,
    private formBuilder: FormBuilder,
  ) {
    this.botModel = new Bot();
  }

  ngOnInit() {
    this.initializeEditBotForm();
    this.getBotFromUrl();
    this.getBots();
  }

  ngOnDestroy(): void {
  }

  initializeEditBotForm(): void {
    this.editBotForm = this.formBuilder.group({
      id: [this.botModel.id, Validators.required],
      bot_name: [this.botModel.botName, Validators.required],
      bot_desc: [this.botModel.botDesc, Validators.required],
      bot_intents: [this.botModel.botIntents, Validators.required],
      bot_slots: [this.botModel.botSlots, Validators.required],
      bot_personal: [this.botModel.botPersonal, Validators.required]
    });

  }

  getBots() {
    this.editService.getAllBots().subscribe(
      (res) => {
        // console.log(res);
        this.bots = res;
        console.log(this.bots)
        this.successUserMessage = 'Success getting bots';
        this.toggleUserMessage(this.successUserMessage, 'success');
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.errorUserMessage = err.error;
        this.toggleUserMessage(this.errorUserMessage, 'danger');
      }
    );
  }

  getBotFromUrl() {
      this.bot = null;
      this.botIdFromUrl = +this.route.snapshot.paramMap.get('id');
      
      if(this.botIdFromUrl) (
      this.editService.getSingleBot(this.botIdFromUrl).subscribe(
      (res) => {
        // console.log(res);
        this.bot = res;
        this.editBotForm.patchValue({
          id: this.bot.id,
          bot_name: this.bot.bot_name,
          bot_desc: this.bot.bot_desc,
          bot_intents: this.bot.bot_intents,
          bot_slots: this.bot.bot_slots,
          bot_personal: this.bot.bot_personal,
        });
        if(this.bot.bot_slots == 'none') {
          this.editBotForm.patchValue({
            bot_slots: 'none',
          });
        }
        const botName = this.bot.bot_name;
        this.successUserMessage = 'Success getting bot: ' + botName;
        this.toggleUserMessage(this.successUserMessage, 'success');
    },
    (err: HttpErrorResponse) => {
        console.log(err);
        this.errorUserMessage = err.error;
        this.toggleUserMessage(this.errorUserMessage, 'danger');
    }
      ));
  }

  getBotFromDropDown(event: any) {
    this.bot = null;
    this.botIdFromDropDown = +event.target.value;

    this.editService.getSingleBot(this.botIdFromDropDown).subscribe(
    (res) => {
      // console.log(res);
      this.bot = res;
      this.editBotForm.patchValue({
        id: this.bot.id,
        bot_name: this.bot.bot_name,
        bot_desc: this.bot.bot_desc,
        bot_intents: this.bot.bot_intents,
        bot_slots: this.bot.bot_slots,
        bot_personal: this.bot.bot_personal,
      });
      if(this.bot.bot_slots == 'none') {
        this.editBotForm.patchValue({
          bot_slots: '',
        });
      }
      const botName = this.bot.bot_name;
      this.successUserMessage = 'Success getting bot: ' + botName;
      this.toggleUserMessage(this.successUserMessage, 'success');
  },
  (err: HttpErrorResponse) => {
      console.log(err);
      this.errorUserMessage = err.error;
      this.toggleUserMessage(this.errorUserMessage, 'danger');
  }
    );
}
  editBotFormSubmit() {
      const data = this.editBotForm.getRawValue();

      if(this.editBotForm.valid) {
      if(!data.bot_slots) {
        data.bot_slots = 'none'
      }

      this.editService.saveBot(data).subscribe(
        (res) => {
          // console.log(res);
          const botName = this.bot.bot_name;
          this.successUserMessage = 'Success updating bot: ' + botName;
          this.toggleUserMessage(this.successUserMessage, 'success');
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.errorUserMessage = err.error;
          this.toggleUserMessage(this.errorUserMessage, 'danger');
        }
      );
    }
  }
    toggleUserMessage(notificationMessage, status) {
      uikit.notification(notificationMessage, {pos: 'bottom-right', status: status});
    }
}
