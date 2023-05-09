import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { ModelGoogleUser } from '../models/ModelGoogleUser';
import { ModelExerciseResults } from '../models/ModelExerciseResults';
import { ExerciseResultsService } from './exercise-results.service';
import { SettingsService } from './settings.service';
import { NotificationService } from './notification.service';
import { ModelNotification } from '../models/ModelNotification';


@Injectable({
   providedIn: 'root'
})
export class GoogleDriveService {

   private _googleUser = new BehaviorSubject<ModelGoogleUser|null>(this._loadGoogleUser()); //email пользователя
   private _googleDriveFile = new BehaviorSubject<ModelExerciseResults|null>(null); //файл на google диске
   private _isRequiredUserActionForSyncData = new BehaviorSubject<boolean>(false); //требуется ли помощь Пользователя в синхронизации данных?
   private _isOpenedPopupSyncData = new BehaviorSubject<boolean>(false); //открыт ли popup синхронизации данных?

   private _apiPath = 'https://www.googleapis.com'; //путь для api
   private _clientId = '432384558724-cf07f9o7ujocrr1ob8s5stgdptsesptr';
   private _clientIdFull = this._clientId + '.apps.googleusercontent.com';
   private _scopes = 'email https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/drive.file';
   private _discovery_docs = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
   private _fileDriveName = 'DataTimer.txt'; //Название файла, хранящие даные таймера

   /**
    * Количество неудачных попыток загрузить google
    * @type {number}
    */
   private _countFailedLoginGoogle: number;
   private _countFailedLoadGoogle: number;


   //для внешнего использования
   public googleUser$ = this._googleUser.asObservable();
   public googleDriveFile$ = this._googleDriveFile.asObservable();
   public isRequiredUserActionForSyncData$ = this._isRequiredUserActionForSyncData.asObservable();
   public isOpenedPopupSyncAction$ = this._isOpenedPopupSyncData.asObservable();

   constructor(
      private http: HttpClient,
      private exerciseResultsService: ExerciseResultsService,
      private settingsService: SettingsService,
      private notificationService: NotificationService) {
      this._countFailedLoadGoogle = 0;
      this._countFailedLoginGoogle = 0;
      this.synchronizationDrive = this.synchronizationDrive.bind(this);
      this.exerciseResultsService.addCallbackChangeExerciseResults(this.synchronizationDrive);
   }


   //set/get
   public set googleUser(newValue: ModelGoogleUser|null) {
      localStorage.setItem('GoogleDrive.googleUser', JSON.stringify(newValue));
      this._googleUser.next(newValue);
   }
   public get googleUser(): ModelGoogleUser|null {
      return this._googleUser.getValue();
   }

   public closePopupGoogleDriveSync() {
      this._isOpenedPopupSyncData.next(false);
   }
   
   public openPopupGoogleDriveSync() {
      this._isOpenedPopupSyncData.next(true);
   }

   /**
    * Авторизация с разрешением права изменения данных на диске
    */
   connectDrive(): Promise<string | null> {
      return this._login();
   }

   /**
    * Отключение подключенного диска
    */
   disconnectDrive(): Promise<boolean> {
      this.googleUser = null;
      this._isRequiredUserActionForSyncData.next(false);
      this._isOpenedPopupSyncData.next(false);
      this._googleDriveFile.next(null);
      return this._logout();
   }

   /**
    * Если на диске нету данных, а в вебе есть -> сохраняем из веба на диск
    * Если на диске есть данные, а в вебе нету -> скачиваем из диска в веб
    * Если на диске есть данные и в вебе -> сверяем время последнего сохранения данных и копируем последние данные в старые
    * Если нигде данных нету -> ничего не делаем
    */
   synchronizationDrive(): Promise<any> {
      this._isRequiredUserActionForSyncData.next(false);
      this._googleDriveFile.next(null);

      //is exist connect drive?
      if (!this.googleUser) {
         return Promise.resolve(null);
      }

      //get access token
      return this._refreshToken().then(() => {

         //found file on google drive
         return this._getIdDriveFile()
            .then(idFile => {
               //locale data
               const currentData = new ModelExerciseResults();
               currentData.dateSave = this.exerciseResultsService.dateSave;
               currentData.data = this.exerciseResultsService.exerciseResults;
               currentData.exerciseTypes = this.settingsService.exerciseTypes;

               if (idFile !== null) { //файл есть 
                  //получаем его данные
                  return this._getDataDriveFile(idFile)
                     .then((dataFile: ModelExerciseResults) => {

                        this._googleDriveFile.next(dataFile);

                        //сравниваем дату последнего сохранения с текущими данными
                        const googleLastDate = dataFile.dateSave;
                        console.info('GoogleDrive. dateGoogle: ' + googleLastDate + ' dateCurrent: ' + currentData.dateSave);

                        //одинакова
                        if (googleLastDate === currentData.dateSave) {
                           console.info('GoogleDrive. data is the same');
                           return;
                        }

                        if (!currentData.dateSave){ //текущие данные ещё пустые
                           console.info('GoogleDrive. update local data', { googleLastDate: googleLastDate, currentLastDate: currentData.dateSave });
                           this.exerciseResultsService.exerciseResults = dataFile.data;
                           this.exerciseResultsService.dateSave = dataFile.dateSave;
                           this.settingsService.exerciseTypes = dataFile.exerciseTypes;
                           this.notificationService.addMessage(new ModelNotification('Данные успешно загружены с Google Drive.', 'success', 5));
                           return;
                        }

                        this.notificationService.addMessage(new ModelNotification('Необходима ручная синхронизация данных', 'warning', 10));
                        console.info('GoogleDrive. data is require User action');
                        this._isRequiredUserActionForSyncData.next(true);
                        this._isOpenedPopupSyncData.next(true);
                        this.settingsService.closePopup();
                        return new Promise<any>(() => true);

                        //на диске более новые - перезаписываем локальные данные
                        /*if (googleLastDate > currentData.dateSave) {
                           console.info('GoogleDrive. update local data', { googleLastDate: googleLastDate, currentLastDate: currentData.dateSave });
                           this.exerciseResultsService.exerciseResults = dataFile.data;
                           this.exerciseResultsService.dateSave = dataFile.dateSave;
                           this.settingsService.exerciseTypes = dataFile.exerciseTypes;
                           this.notificationService.addMessage(new ModelNotification('Данные успешно загружены с Google Drive.', 'success', 5));
                           return;
                        }

                        //сохраняем на google drive
                        console.info('GoogleDrive. data is not the same', googleLastDate, currentData.dateSave);
                        return this._updateDriveFile(idFile, currentData);*/
                     });
               }
               else if (currentData.data && currentData.data.length) { //файла нету и локальные данные существуют
                  //сохраняем на google drive
                  return this._createDriveFile(currentData);
               }
            })
            .catch(err => {
               console.error('GoogleDrive. synchronizationDrive error', err);
               this.notificationService.addMessage(new ModelNotification('Не удалось синхронизировать данные с Google Drive', 'error', 5));
            });
      })
   }

   /** Создаёт Google Drive файл с содержимым */
   private _createDriveFile(dataFile: ModelExerciseResults) {
      const metadata = {
         'name': this._fileDriveName,
         'mimeType': 'text/plain',
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', new Blob([JSON.stringify(dataFile)], { type: 'text/plain' }));

      console.info('GoogleDrive. create data drive file', dataFile);
      return this.http.post(this._apiPath + '/upload/drive/v3/files?uploadType=multipart', form, this._getHeader())
         .toPromise()
         .then(res => {
            this.notificationService.addMessage(new ModelNotification('Данные успешно сохранены в Google Drive.', 'success', 5));
            return res;
         });
   }

   /** Обновляет данные в Google Drive */
   private _updateDriveFile(idFile: string, dataFile: ModelExerciseResults): Promise<any> {
      console.info('GoogleDrive. update data on drive');
      const data = {
         file: JSON.stringify(dataFile)
      };
      return this.http.patch(this._apiPath + '/upload/drive/v3/files/' + idFile + '?uploadType=media&fields=id', data, this._getHeader())
         .toPromise()
         .then(res => {
            this.notificationService.addMessage(new ModelNotification('Данные успешно обновлены в Google Drive.', 'success', 5));
            return res;
         });
   }

   /** Отдаёт содержимое файла на Google drive по id файла */
   private _getDataDriveFile(idFile: string | number): Promise<any> {
      return this.http.get(this._apiPath + '/drive/v3/files/' + idFile + '?alt=media', this._getHeader())
         .toPromise()
         .then((dataFile: any) => {
            console.info('GoogleDrive. loaded from drive:', dataFile);
            
            if (typeof (dataFile) === 'object') {
               if (dataFile.file && typeof (dataFile.file) === 'string') {
                  return JSON.parse(dataFile.file);
               }

               if (dataFile.file && typeof (dataFile.file) === 'object') {
                  return dataFile.file;
               }
            }

            return dataFile;
         })
   }

   /** Получает id файла на google диске с данными таймера */
   private _getIdDriveFile() {
      return this.http.get('https://content.googleapis.com/drive/v3/files?corpus=user&includeTeamDriveItems=false&orderBy=name&pageSize=1&q=name%3D%27'
         + this._fileDriveName + '%27&spaces=drive&supportsTeamDrives=false&key=' + this._clientId, this._getHeader())
         .toPromise()
         .then((data: any) => {
            const idFile = data.files.length > 0 ? data.files[0].id : null;
            if (!idFile) {
               console.info('GoogleDrive. data file not found', { GoogleDriveFileName: this._fileDriveName });
            }
            return idFile;
         });
   }

   /** Авторизация для получения доступа к email и данным на Google Drive */
   private _login(): Promise<string | null> {
      return this._auth2Load()
         .then((auth2: any) => {
            return auth2.signIn()
               .then(() => {
                  const googleUser = auth2.currentUser.get();
                  const access_token = googleUser.getAuthResponse().access_token;
                  sessionStorage.setItem('GoogleDrive.accessToken', access_token);

                  if (!access_token) {
                     return null;
                  }

                  const profile = googleUser.getBasicProfile();
                  const userData = new ModelGoogleUser();
                  userData.email = profile.getEmail();
                  this.googleUser = userData;

                  this.synchronizationDrive();
                  return access_token;
               })
               .catch(error => {
                  if (error.error === 'popup_closed_by_user') {
                     return null;
                  }

                  if (error.error === 'immediate_failed') {
                     this._countFailedLoginGoogle++;
                     if (this._countFailedLoginGoogle > 2) {
                        throw error;
                     }
                     return this._login();
                  }

                  throw error;
               });
         })
         .catch(err => {
            console.error('GoogleDrive. login error', err);
            this.notificationService.addMessage(new ModelNotification('Не удалось авторизоваться в Google.', 'error', 5));
         });
   }

   /**
    * Разлогиниться
    * @return {Promise}
    * @private
    */
   private _logout(): Promise<boolean> {
      return this._auth2Load()
         .then(() => {
            (<any>window).gapi.auth2.getAuthInstance().disconnect();
            sessionStorage.removeItem('GoogleDrive.accessToken');
            this.googleUser = null;
            return true;
         });
   }

   /**
    * Обновление токена доступа к Google
    * @return {Promise}
    * @private
    */
   private _refreshToken(): Promise<string> {
      return this._auth2Load().then((auth2: any) => {
         const googleUser = auth2.currentUser.get();

         return googleUser.reloadAuthResponse()
            .then(res => {
               sessionStorage.setItem('GoogleDrive.accessToken', res.access_token);
               return res.access_token;
            })
            .catch(err => {
               console.error('GoogleDrive. _refreshToken', '!auth2.currentUser', err);
               return auth2.signIn()
                  .then(() => auth2.currentUser.get().getAuthResponse().access_token);
            });
      });
   }

   private _removeGoogleScript() {
      var scripts = document.getElementsByTagName('script')
      var googleScripts = Array.prototype.slice.call(scripts).filter(x => x.src.indexOf('https://apis.google.com/') === 0);
      googleScripts.map(x => x.parentElement.removeChild(x));
   }

   /**
    * Загрузка Google SDK авторизации
    * @return {Promise}
    * @private
    */
   private _auth2Load() {
      return new Promise((ok, err) => {
         if (!(<any>window).gapi) {
            this._removeGoogleScript();
            var script = document.createElement('script');
            script.src = "https://apis.google.com/js/api.js";
            document.body.appendChild(script);

            if (this._countFailedLoadGoogle === 3) { //3sec
               this.notificationService.addMessage(new ModelNotification('Не удалось подключиться к Google Drive, возможно, отсутствует интернет!', 'error', 5));
            }

            if (this._countFailedLoadGoogle < 5) {
               this._countFailedLoadGoogle++;
            }
            setTimeout(() => this._auth2Load().then(ok).catch(err), 3000);
            return null;
         }

         try {
            const gapi = (<any>window).gapi;
            gapi.load('client:auth2', {
               callback: () => {

                  try {
                     let auth2 = gapi.auth2.getAuthInstance();
                     if (!auth2) {
                        auth2 = gapi.auth2.init({
                           client_id: this._clientIdFull,
                           fetch_basic_profile: true,
                           scope: this._scopes
                        });
                     }

                     //for google drive
                     gapi.client.init({ discoveryDocs: this._discovery_docs });

                     ok(auth2);
                  }
                  catch (error2) {
                     err(error2);
                  }
               },
               onerror: () => err('gapi.client failed to load!'),
               ontimeout: () => err('gapi.client could not load in a timely manner!'),
               timeout: 5000, // 5 seconds.
            });
         }
         catch (error) {
            console.error('GoogleDrive. Возможно сайт запущен с локального файла html (Нужно с localhost, как минимум)');
            err(error.message);
         }
      })
         .catch(err => {
            console.error('GoogleDrive. auth error', err);
            this.notificationService.addMessage(new ModelNotification('С Google возникли проблемы. Попробуйте перезагрузить сайт и повторить.', 'error', 5));
         });
   }

   private _loadGoogleUser(): ModelGoogleUser {
      return JSON.parse(localStorage.getItem('GoogleDrive.googleUser') || 'null') || null;
   }

   private _getHeader(): any {
      return {
         headers: new HttpHeaders({
            'Authorization': 'Bearer ' + sessionStorage.getItem('GoogleDrive.accessToken')
         })
      };
   }
}
