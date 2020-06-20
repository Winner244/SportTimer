import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { RefsService } from '../../services/refs.service';
import { Helper } from '../../helpers/Helper';

@Component({
   selector: 'app-faq-canvas',
   templateUrl: './faq-canvas.component.html',
   styleUrls: ['./faq-canvas.component.less']
})
export class FaqCanvasComponent implements OnInit {
   isShow: boolean;
   ctx: any;

   buttonSettings: ElementRef;
   buttonAddExercise: ElementRef;

   @ViewChild('canvas')
   canvas: ElementRef<HTMLCanvasElement>;

   private _destroyed: Subject<any> = new Subject();

   constructor(private refsService: RefsService) {
   }

   ngOnInit() {
      let urlParameters = Helper.getUrlParameters();

      if(urlParameters.faq){
         document.getElementsByTagName('body')[0].style.overflow = 'hidden';
         this.isShow = true;
         this.ctx = this.canvas.nativeElement.getContext('2d');

         //подписка на появление и измнение кнопки настроек
         this.refsService.buttonSettings$
            .pipe(takeUntil(this._destroyed))
            .subscribe(value => {
               this.buttonSettings = value;
               this.draw();
            });

         //подписка на появление и измнение кнопки добавления упражнения в настройках
         this.refsService.buttonAddExercise$
            .pipe(takeUntil(this._destroyed))
            .subscribe(value => {
               this.buttonAddExercise = value;
               this.draw();
            });
      }
   }

   draw(){
      this.canvas.nativeElement.width = window.innerWidth;
      this.canvas.nativeElement.height = window.innerHeight;

      let urlParameters = Helper.getUrlParameters();
      if(urlParameters.faq == 'button-settings'){
         this.drawFaqButtonSettings();
      }
      else if(urlParameters.faq == 'settings'){
         this.drawFaqSettings();
      }
   }

   drawFaqButtonSettings(){
      if(this.buttonSettings){
         let pointFrom = {x: window.innerWidth / 1.5, y: window.innerHeight / 3};
         let pointTo = {
            x: this.buttonSettings.nativeElement.offsetLeft + this.buttonSettings.nativeElement.offsetWidth / 2, 
            y: this.buttonSettings.nativeElement.offsetTop + this.buttonSettings.nativeElement.offsetHeight / 2
         };
         this.drawRedArrow(pointFrom, pointTo, 7, 20);
      }
   }

   drawFaqSettings(){
      if(this.buttonSettings){
         this.buttonSettings.nativeElement.click();
         if(this.buttonAddExercise){
            let pointFrom = {x: window.innerWidth / 1.5, y: window.innerHeight / 3};
            let pointTo = {
               x: this.buttonAddExercise.nativeElement.offsetLeft + this.buttonAddExercise.nativeElement.offsetWidth / 2, 
               y: this.buttonAddExercise.nativeElement.offsetTop + this.buttonAddExercise.nativeElement.offsetHeight / 2
            };
            console.log('drawFaqSettings', this.buttonAddExercise.nativeElement, this.buttonAddExercise.nativeElement.offsetLeft, this.buttonAddExercise.nativeElement.offsetWidth);
            this.drawRedArrow(pointFrom, pointTo, 7, 20);
         }
      }
   }


   drawRedArrow(p1 : {x: number, y: number}, p2: {x: number, y: number}, size : number, distanseToEnd : number) {
      let angle = Math.atan2((p2.y - p1.y) , (p2.x - p1.x));
      let hyp = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));

      this.ctx.save();
      this.ctx.translate(p1.x, p1.y);
      this.ctx.rotate(angle);

      // line
      this.ctx.lineWidth = size;
      this.ctx.strokeStyle = 'red';
      this.ctx.beginPath();	
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(hyp - size - distanseToEnd, 0);
      this.ctx.stroke();

      // triangle
      this.ctx.fillStyle = 'red';
      this.ctx.beginPath();
      this.ctx.lineTo(hyp - size * 2 - distanseToEnd - 20, size * 2);
      this.ctx.lineTo(hyp - distanseToEnd, 0);
      this.ctx.lineTo(hyp - size * 2 - distanseToEnd - 20, -size * 2);
      this.ctx.fill();

      this.ctx.restore();
   }
}
