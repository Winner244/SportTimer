import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class RefsService {

   private _buttonSettings = new BehaviorSubject<ElementRef>(null); //кнопка открывающая настройки
   
   //для внешнего использования
   public buttonSettings$ = this._buttonSettings.asObservable();

   constructor() { }

   //set
   public set buttonSettings(buttonSettingsRef: ElementRef) {
      this._buttonSettings.next(buttonSettingsRef);
   }
}
