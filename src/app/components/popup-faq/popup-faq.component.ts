import { Component} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { FAQService } from '../../services/faq.service';

@Component({
   selector: 'app-popup-faq',
   templateUrl: './popup-faq.component.html',
   styleUrls: ['./popup-faq.component.less']
})
export class PopupFAQComponent {
   isOpen: boolean;

   private _destroyed: Subject<any> = new Subject();

   constructor(private faqService: FAQService) 
   {
      this.faqService.isOpen$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => {
            this.isOpen = value;
         });
   }

   ngOnDestroy() {
      this._destroyed.next();
      this._destroyed.complete();
   }

   onClose() {
      this.faqService.closePopup();
   }
}
