import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { StringExtension } from './StringExtension';
import { ArrayExtension } from './ArrayExtension';

import { HeaderComponent } from './components/header/header.component';
import { AppComponent } from './components/app/app.component';
import { TimerComponent } from './components/timer/timer.component';
import { TimerControlComponent } from './components/timer-control/timer-control.component';
import { TimerSettingsComponent } from './components/timer-settings/timer-settings.component';

StringExtension.on();
ArrayExtension.on();

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TimerComponent,
    TimerControlComponent,
    TimerSettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
	  FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
