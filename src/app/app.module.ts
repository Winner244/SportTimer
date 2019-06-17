import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { StringExtension } from './helpers/StringExtension';
import { ArrayExtension } from './helpers/ArrayExtension';

import { HeaderComponent } from './components/header/header.component';
import { AppComponent } from './components/app/app.component';
import { TimerComponent } from './components/timer/timer.component';
import { TimerControlComponent } from './components/timer-control/timer-control.component';
import { TimerSettingsComponent } from './components/timer-settings/timer-settings.component';
import { ExerciseResultsComponent } from './components/exercise-results/exercise-results.component';
import { ExerciseResultsControlComponent } from './components/exercise-results-control/exercise-results-control.component';
import { ExerciseResultsSettingsComponent } from './components/exercise-results-settings/exercise-results-settings.component';
import { ExerciseResultsStatisticsComponent } from './components/exercise-results-statistics/exercise-results-statistics.component';
import { ExerciseResultsTableComponent } from './components/exercise-results-table/exercise-results-table.component';
import { NavigationPanelComponent } from './components/navigation-panel/navigation-panel.component';
import { PopupSettingsComponent } from './components/popup-settings/popup-settings.component';
import { PopupComponent } from './components/popup/popup.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { PopupChartComponent } from './components/popup-chart/popup-chart.component';
import { PopupResultsComponent } from './components/popup-results/popup-results.component';
import { PopupResultInfoComponent } from './components/popup-result-info/popup-result-info.component';
import { PopupTimerSettingsComponent } from './components/popup-timer-settings/popup-timer-settings.component';

StringExtension.on();
ArrayExtension.on();

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TimerComponent,
    TimerControlComponent,
    TimerSettingsComponent,
    ExerciseResultsComponent,
    ExerciseResultsControlComponent,
    ExerciseResultsSettingsComponent,
    ExerciseResultsStatisticsComponent,
    ExerciseResultsTableComponent,
    NavigationPanelComponent,
    PopupSettingsComponent,
    PopupComponent,
    CheckboxComponent,
    NotificationsComponent,
    PopupChartComponent,
    PopupResultsComponent,
    PopupResultInfoComponent,
    PopupTimerSettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
