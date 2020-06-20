import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class RefsService {

   private _buttonSettings = new BehaviorSubject<ElementRef>(null); //кнопка открывающая настройки
   private _buttonAddExercise = new BehaviorSubject<ElementRef>(null); //кнопка добавления упражнения в настройках
   
   //для внешнего использования
   public buttonSettings$ = this._buttonSettings.asObservable();
   public buttonAddExercise$ = this._buttonAddExercise.asObservable();

   constructor() { }

   //set
   public set buttonSettings(buttonSettingsRef: ElementRef) {
      this._buttonSettings.next(buttonSettingsRef);
   }
   
   public set buttonAddExercise(buttonAddExerciseRef: ElementRef) {
      this._buttonAddExercise.next(buttonAddExerciseRef);
   }
}
