import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class TrainService {
  
  private baseUrl: string;

  constructor(private http: HttpClient) { 
    this.baseUrl = environment.restApi.uri
   }
  private options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

  getAllBots() {
     return this.http.get<any>(
      this.baseUrl + '/bot/get_bots'
    );
  }
  getSingleBot(botId: number) {
    return this.http.post<any>(
      this.baseUrl + '/bot/get_bot', botId
    );
  }
  createIntent(data: any) {
    return this.http.post<any>(
      this.baseUrl + '/intent/create_intent', data
    );
  }
  createSvp(data: any) {
    return this.http.post<any>(
      this.baseUrl + '/svp/create_svp', data
    );
  }
  getAllIntents(botId: number, selectedIntent) {
    return this.http.post<any>(
      this.baseUrl + '/intent/get_intents', {botId, selectedIntent}
    );
  }

  getAllTrainingIntents(botId: number) {
    return this.http.post<any>(
      this.baseUrl + '/intent/get_training_intents', botId
    );
  }
    getAllSvps(botId, selectedIntent) {
    return this.http.post<any>(
      this.baseUrl + '/svp/get_svps', {botId, selectedIntent}
    );
  }
  deleteSingleUtterance(intentId) {
    return this.http.post<any>(
      this.baseUrl + '/intent/delete_intent', intentId
    );
  }
    deleteSingleSvp(svpId) {
    return this.http.post<any>(
      this.baseUrl + '/svp/delete_svp', svpId
    );
  }
  feedIntents(intentData: any) {
    return this.http.post<any>(
      this.baseUrl + '/intent/feed_intents', intentData
    );
  }
  feedSvps(svpData: any) {
    return this.http.post<any>(
      this.baseUrl + '/svp/feed_svps', svpData
    );
  }
  trainClassifierModel() {
    return this.http.post<any>(
      this.baseUrl + '/model/train_classifier_model', this.options
    );
  }
  trainSvpModel(selectedIntent) {
    return this.http.post<any>(
      this.baseUrl + '/model/train_svp_model', {selectedIntent}, this.options
    );
  }

}
