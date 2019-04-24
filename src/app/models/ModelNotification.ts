import { Helper } from '../Helper';

/**
 * Сообщение
 */
export class ModelNotification{
    uid: string;
    text: string;
    type: 'success' | 'error';
    endTime: number; //unixTime

    private lifetime: number; //время показа сообщения (в секундах)
    private startTime: number; //unixTime

    constructor(text: string, type: 'success' | 'error', lifetime: number){
        this.text = text || '';
        this.type = type || 'error';

        this.lifetime = lifetime || 5;
        this.startTime = Date.now();

        this.endTime = this.startTime + this.lifetime * 1000;
        this.uid = Helper.generateUid();

    }
}