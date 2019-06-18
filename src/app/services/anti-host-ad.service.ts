import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root'
})
/** Против рекламы от хоста */
export class AntiHostAdService {
   public removeAd(){
      const bodyElements = document.getElementsByTagName('body')[0].children;
      for(let i = 0; i < bodyElements.length; i++){
         if(bodyElements[i].tagName === 'DIV'){
            bodyElements[i].remove();
            break;
         }
      }
   }
}
