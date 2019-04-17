import { Component, OnDestroy } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

@Component({
  selector: 'app-popup-settings',
  templateUrl: './popup-settings.component.html',
  styleUrls: ['./popup-settings.component.less']
})
export class PopupSettingsComponent implements OnDestroy {
  isOpen: boolean = false;

  private _destroyed: Subject<any> = new Subject();

  constructor(private settingsService: SettingsService) { 
    this.settingsService.isOpen$
      .pipe(takeUntil(this._destroyed))
      .subscribe(value => this.isOpen = value);
  }

  ngOnDestroy(){
    this._destroyed.next();
    this._destroyed.complete();
  }

  onClose(){
    this.settingsService.isOpen = false;
  }
}
