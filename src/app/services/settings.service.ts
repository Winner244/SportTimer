import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private _isOpen = new BehaviorSubject<boolean>(false); //окно открыто?

  //для внешнего использования
  public isOpen$ = this._isOpen.asObservable();
  public isOnPushMessage: boolean;

  constructor() { }

  
  public set isOpen(newValue: boolean){
    this._isOpen.next(newValue);
  }
  public get isOpen(): boolean{
    return this._isOpen.getValue();
  }
}
