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

    private _googleUser = new BehaviorSubject<ModelGoogleUser>(this._loadGoogleUser()); //email пользователя

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

    constructor(
        private http: HttpClient,
        private exerciseResultsService: ExerciseResultsService,
        private settingsService: SettingsService,
        private notificationService: NotificationService) { }

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
        localStorage.removeItem('GoogleDrive.googleUser');
        return this._logout();
    }

    /**
     * Если на диске нету данных, а в вебе есть -> сохраняем из веба на диск
     * Если на диске есть данные, а в вебе нету -> скачиваем из диска в веб
     * Если на диске есть данные и в вебе -> сверяем время последнего сохранения данных и копируем последние данные в старые
     * Если нигде данных нету -> ничего не делаем
     */
    synchronizationDrive() {
        console.log('synchronizationDrive');
        //is exist connect drive?
        if (!localStorage.getItem('GoogleDrive.googleUser')) {
            return null;
        }
        console.log('synchronizationDrive2');

        //get access token
        this._refreshToken().then(() => {
            console.log('synchronizationDrive3');

            //found file on google drive
            return this._getIdFile()
                .then(id => {
                    console.log('synchronizationDrive4');
                    //locale data
                    const currentData = new ModelExerciseResults();
                    currentData.dateSave = this.exerciseResultsService.dateSave;
                    currentData.data = this.exerciseResultsService.exerciseResults;
                    currentData.exerciseTypes = this.settingsService.exerciseTypes;

                    if (id !== null) {
                        //файл есть - получаем его данные
                        return this._getFile(id)
                            .then((dataFile: ModelExerciseResults) => {
                                //сравниваем дату последнего сохранения с текущими данными
                                const googleLastDate = dataFile['dateSave'];

                                //на диске более новые - перезаписываем локальные данные
                                if (googleLastDate > currentData.dateSave) {
                                    this.exerciseResultsService.exerciseResults = dataFile.data;
                                    this.exerciseResultsService.dateSave = dataFile.dateSave;
                                    this.settingsService.exerciseTypes = dataFile.exerciseTypes;
                                    this.notificationService.addMessage(new ModelNotification('Данные успешно загружены с Google Drive.', 'success', 5));
                                    return;
                                }

                                //одинакова
                                if (googleLastDate === currentData.dateSave) {
                                    return;
                                }

                                const data = {
                                    file: JSON.stringify(currentData)
                                };

                                //сохраняем на google drive
                                return this.http.patch(this._apiPath + '/upload/drive/v3/files/' + id + '?uploadType=media&fields=id', data, this._getHeader())
                                    .toPromise()
                                    .then(res => {
                                        this.notificationService.addMessage(new ModelNotification('Данные успешно обновлены в Google Drive.', 'success', 5));
                                        return res;
                                    });
                            });
                    }
                    else if (currentData.data && currentData.data.length) { //файла нету и локлаьные данные существуют
                        const data = {
                            metadata: {
                                'name': this._fileDriveName,
                                'mimeType': 'text/plain',
                            },
                            file: JSON.stringify(currentData)
                        };

                        //сохраняем на google drive
                        return this.http.post(this._apiPath + '/upload/drive/v3/files?uploadType=multipart&fields=id', data, this._getHeader())
                            .toPromise()
                            .then(res => {
                                this.notificationService.addMessage(new ModelNotification('Данные успешно сохранены в Google Drive.', 'success', 5));
                                return res;
                            });
                    }
                })
                .catch(err => {
                    console.info('synchronizationDrive error', err);
                    this.notificationService.addMessage(new ModelNotification('Не удалось синхронизировать данные с Google Drive', 'error', 5));
                });
        })
    }

    /**
     * Отдаёт содержимое файла на google drive по id файла
     */
    private _getFile(idFile: string | number): Promise<any> {
        return this.http.get(this._apiPath + '/drive/v3/files/' + idFile + '?alt=media', this._getHeader())
            .toPromise()
            .then(dataFile => dataFile + '')
            .then((dataFile: string) => {
                dataFile = dataFile.substr(dataFile.indexOf('{'));
                dataFile = dataFile.substr(0, dataFile.lastIndexOf('}') + 1);
                return JSON.parse(dataFile);
            })
    }

    /**
     * Получает id файла на google диске с данными таймера
     * @return Promise<>
     */
    private _getIdFile() {
        return this.http.get('https://content.googleapis.com/drive/v3/files?corpus=user&includeTeamDriveItems=false&orderBy=name&pageSize=1&q=name%3D%27'
            + this._fileDriveName + '%27&spaces=drive&supportsTeamDrives=false&key=' + this._clientId, this._getHeader())
            .toPromise()
            .then((data: any) => data.files.length > 0 ? data.files[0].id : null);
    }

    /**
     * Авторизация для получения доступа к email и данным на Google Drive
     * @return {Promise}
     * @private
     */
    private _login(): Promise<string | null> {
        return this._auth2Load()
            .then((auth2: any) => {
                console.log('_login', auth2);
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
                        localStorage.setItem('GoogleDrive.googleUser', JSON.stringify(userData));

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
                console.info('login error', err);
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
                localStorage.removeItem('GoogleDrive.googleUser');
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
                    console.info('_refreshToken', '!auth2.currentUser', err);
                    return auth2.signIn()
                        .then(() => auth2.currentUser.get().getAuthResponse().access_token);
                });
        });
    }

    /**
     * Загрузка Google SDK авторизации
     * @return {Promise}
     * @private
     */
    private _auth2Load() {
        return new Promise((ok, err) => {
            if (!(<any>window).gapi) {
                this._countFailedLoadGoogle++;
                if(this._countFailedLoadGoogle > 5){ //3sec
                    err('Could not load google sdk!');
                    return null;
                }
                setTimeout(() => this._auth2Load().then(ok).catch(err), 500);
                return null;
            }

            try {
                const gapi = (<any>window).gapi;
                gapi.load('client:auth2', {
                    callback: () => {
                        const params = {
                            client_id: this._clientIdFull,
                        };
                        params['fetch_basic_profile'] = true;
                        params['scope'] = this._scopes;

                        try {
                            const auth2 = gapi.auth2.getAuthInstance() || gapi.auth2.init(params);

                            //for google drive
                            gapi.client.init({
                                _clientId: this._clientIdFull,
                                discoveryDocs: this._discovery_docs,
                                scope: this._scopes
                            });

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
                console.error('Возможно сайт запущен с локального файла html (Нужно с localhost, как минимум)');
                err(error.message);
            }
        })
        .catch(err => {
            console.info('login error', err);
            this.notificationService.addMessage(new ModelNotification('С Google возникли проблемы. Попробуйте перезагрузить сайт и повторить.', 'error', 5));
        });
    }

    private _loadGoogleUser() : ModelGoogleUser{
        return JSON.parse(localStorage.getItem('GoogleDrive.googleUser') || 'null') || null;
    }

    private _getHeader() : any{
        return {
            headers: new HttpHeaders({
              'Authorization':  'Bearer ' + sessionStorage.getItem('GoogleDrive.accessToken')
            })
          };
    }
}
