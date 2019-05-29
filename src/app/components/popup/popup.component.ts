import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
   selector: 'app-popup',
   templateUrl: './popup.component.html',
   styleUrls: ['./popup.component.less']
})
export class PopupComponent implements OnInit {

   @Input() title: string;
   @Input() isOpen: boolean;

   @Input() width: string = '700px';
   @Input() height: string = '500px';
   @Input() left: string = 'calc(50% - 350px)';
   @Input() top: string = '100px';
   @Input() paddingBody: string = '15px 20px';
   @Input() position: string = 'fixed';

   width2: string; //it width changed in onResize 
   left2: string; //it left changed in onResize 

   @Output() onClose = new EventEmitter<void>();


   ngOnInit(){
      this.width2 = this.width;
      this.onResize();
   }

   close() {
      this.onClose.emit();
   }

   public onResize() {
      if(this.width.indexOf('px') > -1 && parseInt(this.width) > window.innerWidth){
         this.width2 = window.innerWidth + 'px';
         this.left2 = '0';
      }
      else{
         this.width2 = this.width;
         this.left2 = this.left;
      }
   }
}
