import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class PopupChartService {

   private _isOpen = new BehaviorSubject<boolean>(false); //окно открыто?

   //для внешнего использования
   public isOpen$ = this._isOpen.asObservable();

   constructor() { }

   //set/get
   private set isOpen(newValue: boolean) {
      this._isOpen.next(newValue);
   }
   private get isOpen(): boolean {
      return this._isOpen.getValue();
   }

   public openPopup(){
      this.isOpen = true;
   }

   public closePopup(){
      this.isOpen = false;
   }
}
