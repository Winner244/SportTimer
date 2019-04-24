import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModelNotification } from '../models/ModelNotification';

//Показ сообщение в правом, верхнем углу
@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {

  private _messages = new BehaviorSubject<ModelNotification[]>([]); //сообщения

  private _timerRemoveMessages: NodeJS.Timer; //интервал для удаления сообщений

  //для внешнего использования
  public messages$ = this._messages.asObservable();
  
  constructor() { 
    this.removeMessages = this.removeMessages.bind(this);

    this._timerRemoveMessages = null;
  }

  ngOnDestroy() {
    clearTimeout(this._timerRemoveMessages);
  }

  //set/get
  public set messages(newValue: ModelNotification[]){
    this._messages.next(newValue);
  }
  public get messages(): ModelNotification[]{
    return this._messages.getValue();
  }


  removeMessages(){
    console.log('removeMessages');
    this.messages = this.messages.filter(x => x.endTime < Date.now());
    if(this.messages.length){
      this._timerRemoveMessages = setTimeout(this.removeMessages, this.messages.last().endTime - Date.now());
    }
  }

  addMessage(newMessage: ModelNotification){
    this.messages = this.messages.concat(newMessage);

    if(!this._timerRemoveMessages){
      this._timerRemoveMessages = setTimeout(this.removeMessages, newMessage.endTime - Date.now());
    }
  }
}
