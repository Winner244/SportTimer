import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { HeaderComponent } from './components/header/header.component';
import { AppComponent } from './components/app/app.component';
import { TimerViewComponent } from './components/timer-view/timer-view.component';
import { TimerControlComponent } from './components/timer-control/timer-control.component';

import { StringExtension } from './StringExtension';
import { ArrayExtension } from './ArrayExtension';

StringExtension.on();
ArrayExtension.on();

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TimerViewComponent,
    TimerControlComponent
  ],
  imports: [
    BrowserModule,
	  FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
