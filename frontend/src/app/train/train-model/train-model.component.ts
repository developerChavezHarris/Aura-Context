import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TrainService} from '../train.service';
import {FeedIntentsModel} from '../../models/feed-intents.model';
import {FeedSvpsModel} from '../../models/feed-svps.model';
import * as uikit from 'uikit';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-train-model',
  templateUrl: './train-model.component.html',
  styleUrls: ['./train-model.component.css']
})
export class TrainModelComponent implements OnInit {
  @ViewChild('divIntentData', {static: false}) divIntentData: ElementRef;
  private bots: any;
  private botId: any;
  private intents: any;
  private selectedBot: any;
  private intentsAndUtterances: any;
  private botSvps: any;
  private selectedIntent: any;
  private string;
  private has_slots: boolean;
  private canTrainClassifierModel: boolean;
  private canTrainSvpModel: boolean;
  private trainProgress: boolean;
  private trainCompleted: boolean;

  public successUserMessage: string;
  public errorUserMessage: string;

  constructor(
    private trainService: TrainService,
    private elemRef: ElementRef,
  ) { }

  ngOnInit() {
    this.getBots();
  }
   getBots() {
    this.trainService.getAllBots().subscribe(
      (res) => {
        // console.log(res);
        this.bots = res;
        // console.log(this.bots);
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
  getBot(event: any) {
    const botId = +event.target.value;
    this.botId = botId;
    this.intentsAndUtterances = [];
    this.botSvps = [];
    this.getTrainingIntents(botId);
    this.trainService.getSingleBot(botId).subscribe(
      (res) => {
        // console.log(res);
        this.selectedBot = res;
        if(this.selectedBot.bot_slots == 'none') {
          this.has_slots = false;
          // console.log(this.has_slots);
        } else {
          this.has_slots = true;
        }
        this.string = this.selectedBot.bot_intents.replace(/\s/g, '');
        this.intents = this.string.split(',');
        // this.getIntents(botId);
        // this.getSvps(botId, this.selectedIntent);
        const botName = this.selectedBot.bot_name;
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

  getSelectedIntent(event: any) {
    this.selectedIntent = event.target.value;
    if(this.has_slots == true) {
    this.botSvps = [];
    this.getSvps(this.botId, this.selectedIntent);
    }
  }


  getIntents(botId: number, selectedIntent) {
    this.trainService.getAllIntents(botId, selectedIntent).subscribe(
      (res) => {
        // console.log(res);
        this.intentsAndUtterances = [];
        this.intentsAndUtterances = res;
        this.successUserMessage = 'Success getting intents';
        this.toggleUserMessage(this.successUserMessage, 'success');
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.errorUserMessage = err.error;
        this.toggleUserMessage(this.errorUserMessage, 'danger');
      }
    );
  }

  getTrainingIntents(botId: number) {
    this.trainService.getAllTrainingIntents(botId).subscribe(
      (res) => {
        //  console.log(res);
        this.intentsAndUtterances = [];
        this.intentsAndUtterances = res;
        this.successUserMessage = 'Success getting intents';
        this.toggleUserMessage(this.successUserMessage, 'success');
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.errorUserMessage = err.error;
        this.toggleUserMessage(this.errorUserMessage, 'danger');
      }
    );

  }
    getSvps(botId: number, selectedIntent: any) {
    this.trainService.getAllSvps(botId, selectedIntent).subscribe(
      (res) => {
        // console.log(res);
        this.botSvps = [];
        this.botSvps = res;
        this.successUserMessage = 'Success getting svps';
        this.toggleUserMessage(this.successUserMessage, 'success');
      },
      (err) => {
        console.log(err);
        this.errorUserMessage = err.error;
        this.toggleUserMessage(this.errorUserMessage, 'danger');
      }
    );
  }

  feedIntents() {
    this.trainCompleted = false;
    this.trainProgress = false;
    const feedIntentModel = new FeedIntentsModel();
    const intentData: string = this.elemRef.nativeElement.querySelectorAll('.intentData')[0].innerText;
    feedIntentModel.intentData = intentData;
    this.trainService.feedIntents(feedIntentModel).subscribe(
    (res) => {
      // console.log(res);
      this.successUserMessage = 'Success feeding intents';
      this.toggleUserMessage(this.successUserMessage, 'success');
      this.canTrainClassifierModel = true;
    },
      (err: HttpErrorResponse) => {
      console.log(err);
      this.errorUserMessage = err.error;
      this.toggleUserMessage(this.errorUserMessage, 'danger');
      }
      );
  }

 feedSvps() {
    this.trainCompleted = false;
    this.trainProgress = false;
    const feedSvpModel = new FeedSvpsModel();
    const svpData = this.elemRef.nativeElement.querySelectorAll('.svpData')[0].innerText;
    feedSvpModel.svpData = svpData;
    // console.log(intentData);
    this.trainService.feedSvps(feedSvpModel).subscribe(
     (res) => {
      //  console.log(res);
       this.successUserMessage = 'Success feeding svps';
       this.toggleUserMessage(this.successUserMessage, 'success');
       this.canTrainSvpModel = true;
     },
     (err: HttpErrorResponse) => {
       console.log(err);
       this.errorUserMessage = err.error;
       this.toggleUserMessage(this.errorUserMessage, 'danger');
     }
   );
  }

  trainClassifierModel() {
    this.canTrainClassifierModel = false;
    this.show_training_status_model();
    this.trainService.trainClassifierModel().subscribe(
      (res) => {
        // console.log(res);
        this.successUserMessage = 'Success training classifier model';
        this.toggleUserMessage(this.successUserMessage, 'success');
        this.trainCompleted = true;
        this.trainProgress = false;
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.errorUserMessage = err.error;
        this.toggleUserMessage(this.errorUserMessage, 'danger');
      }
    );
  }

    trainSvpModel() {
    this.canTrainSvpModel = false;
    this.trainCompleted = false;
    this.trainProgress = true;
    this.show_training_status_model();
    this.trainService.trainSvpModel(this.selectedIntent).subscribe(
      (res) => {
        // console.log(res);
        this.successUserMessage = 'Success training svp model';
        this.toggleUserMessage(this.successUserMessage, 'success');
        this.trainCompleted = true;
        this.trainProgress = false;
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.errorUserMessage = err.error;
        this.toggleUserMessage(this.errorUserMessage, 'danger');
      }
    );
  }

  toggleUserMessage(notificationMessage, status) {
    uikit.notification(notificationMessage, {pos: 'bottom-right', status: status});
  }

  show_training_status_model() {
    this.trainCompleted = false;
    this.trainProgress = true;
    uikit.modal('#training_status_modal').show();
  }  
     
    
      
 
}