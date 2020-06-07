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
  private update_intents: any;
  private selectedUpdateIntent: string;
  private selectedBot: any;
  private intentsAndUtterances: any;
  private updateSenseData: any;
  private botSvps: any;
  private selectedIntent: any;
  private string;
  private has_slots: boolean;
  private canTrainClassifierModel: boolean;
  private canTrainUpdateSenseClassifierModel: boolean;
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
        if(res.length > 0) {
          this.successUserMessage = 'Success getting bots';
          this.toggleUserMessage(this.successUserMessage, 'success');
        }
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
        this.update_intents = this.intents.filter(s => s.includes('update'));
        console.log('Update Intents', this.update_intents);
        // this.getIntents(botId);
        // this.getSvps(botId, this.selectedIntent);
        const botName = this.selectedBot.bot_name;
        if (res) {
        this.successUserMessage = 'Success getting bot: ' + botName;
        this.toggleUserMessage(this.successUserMessage, 'success');
        }
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

  getSelectedUpdateIntent(event: any) {
    this.selectedIntent = event.target.value;
    this.getUpdateSenseData(this.botId);
    this.trainService.getSelectedUpdateIntents(this.botId, this.selectedIntent).subscribe(
      (res) => {
        //  console.log(res);
        this.intentsAndUtterances = [];
        this.intentsAndUtterances = res;
        if(res.length > 0) {
          this.successUserMessage = 'Success getting intents';
          this.toggleUserMessage(this.successUserMessage, 'success');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.errorUserMessage = err.error;
        this.toggleUserMessage(this.errorUserMessage, 'danger');
      }
    );
  }

  getUpdateSenseData(botId: number) {
    this.trainService.getUpdateSenseData(botId).subscribe(
      (res) => {
         console.log(res);
        this.updateSenseData = [];
        this.updateSenseData = res;
        if(res.length > 0) {
          this.successUserMessage = 'Success getting intents';
          this.toggleUserMessage(this.successUserMessage, 'success');
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.errorUserMessage = err.error;
        this.toggleUserMessage(this.errorUserMessage, 'danger');
      }
    );
  }


  getIntents(botId: number, selectedIntent) {
    this.trainService.getAllIntents(botId, selectedIntent).subscribe(
      (res) => {
        console.log(res);
        this.intentsAndUtterances = [];
        this.intentsAndUtterances = res;
        if (res.length > 0) {
          this.successUserMessage = 'Success getting intents';
          this.toggleUserMessage(this.successUserMessage, 'success');
        }
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
        if(res.length > 0) {
          this.successUserMessage = 'Success getting intents';
          this.toggleUserMessage(this.successUserMessage, 'success');
        }
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
        if(res.length > 0) {
          this.successUserMessage = 'Success getting svps';
          this.toggleUserMessage(this.successUserMessage, 'success');
        }
      },
      (err: HttpErrorResponse) => {
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
    if(this.selectedIntent) {
      this.selectedUpdateIntent = this.selectedIntent;
    } else {
      this.selectedUpdateIntent = 'none';
    }
    feedIntentModel.intentData = intentData;
    this.trainService.feedIntents(feedIntentModel, this.selectedUpdateIntent).subscribe(
    (res) => {
      // console.log(res);
      if(res.length > 1) {
      this.successUserMessage = 'Success feeding intents';
      this.toggleUserMessage(this.successUserMessage, 'success');
      this.canTrainClassifierModel = true;
      }
      
    },
      (err: HttpErrorResponse) => {
      console.log(err);
      this.errorUserMessage = err.error;
      this.toggleUserMessage(this.errorUserMessage, 'danger');
      }
      );
  }

  feedUpdateSense() {
    this.trainCompleted = false;
    this.trainProgress = false;
    const feedIntentModel = new FeedIntentsModel();
    const updateSenseData: string = this.elemRef.nativeElement.querySelectorAll('.UpdateSenseData')[0].innerText;
    console.log(updateSenseData)
    feedIntentModel.intentData = updateSenseData;
    this.trainService.feedUpdateSense(feedIntentModel).subscribe(
    (res) => {
      // console.log(res);
      if(res.length > 1) {
      this.successUserMessage = 'Success feeding Sense Data';
      this.toggleUserMessage(this.successUserMessage, 'success');
      this.canTrainUpdateSenseClassifierModel = true;
      }
      
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
    if(this.selectedIntent) {
      this.selectedUpdateIntent = this.selectedIntent;
    } else {
      this.selectedUpdateIntent = 'none';
    }
    feedSvpModel.svpData = svpData;
    // console.log(intentData);
    this.trainService.feedSvps(feedSvpModel, this.selectedIntent).subscribe(
     (res) => {
      //  console.log(res);
      if(res.length > 1) {
        this.successUserMessage = 'Success feeding svps';
        this.toggleUserMessage(this.successUserMessage, 'success');
        this.canTrainSvpModel = true;
      }
      
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
    if(this.selectedIntent) {
      this.selectedUpdateIntent = this.selectedIntent;
    } else {
      this.selectedUpdateIntent = 'none';
    }
    this.trainService.trainClassifierModel(this.selectedUpdateIntent).subscribe(
      (res) => {
        // console.log(res);
        if(res.length > 1) {
          this.successUserMessage = 'Success training classifier model';
          this.toggleUserMessage(this.successUserMessage, 'success');
          this.trainCompleted = true;
          this.trainProgress = false;
        }
       
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.errorUserMessage = err.error;
        this.toggleUserMessage(this.errorUserMessage, 'danger');
        this.hide_training_status_model();
      }
    );
  }

  trainUpdateSenseClassifierModel() {
    this.canTrainUpdateSenseClassifierModel = false;
    this.show_training_status_model();

    this.trainService.trainUpdateSenseClassifierModel().subscribe(
      (res) => {
        // console.log(res);
        if(res.length > 1) {
          this.successUserMessage = 'Success training update sense classifier model';
          this.toggleUserMessage(this.successUserMessage, 'success');
          this.trainCompleted = true;
          this.trainProgress = false;
        }
       
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.errorUserMessage = err.error;
        this.toggleUserMessage(this.errorUserMessage, 'danger');
        this.hide_training_status_model();
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
        if(res.length > 1) {
          this.successUserMessage = 'Success training svp model';
          this.toggleUserMessage(this.successUserMessage, 'success');
          this.trainCompleted = true;
          this.trainProgress = false;
        }
       
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.errorUserMessage = err.error;
        this.toggleUserMessage(this.errorUserMessage, 'danger');
        this.hide_training_status_model();
      }
    );
  }

  importJson(event, dom_element) {
    const file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
      this.elemRef.nativeElement.querySelectorAll(dom_element)[0].innerText = fileReader.result;
    }
    fileReader.readAsText(file);
  }

  toggleUserMessage(notificationMessage, status) {
    uikit.notification(notificationMessage, {pos: 'bottom-right', status: status});
  }

  show_training_status_model() {
    this.trainCompleted = false;
    this.trainProgress = true;
    uikit.modal('#training_status_modal').show();
  }  

  hide_training_status_model() {
    uikit.modal('#training_status_modal').hide();
  }  
     
    
      
 
}