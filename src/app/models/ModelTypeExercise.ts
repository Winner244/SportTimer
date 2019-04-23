import { Helper } from '../Helper';

/**
 * Тип упражнения
 */
export class ModelTypeExercise{
    uid: string;
    name: string;

    constructor(uid = '', name = ''){
        this.uid = uid || Helper.generateUid();
        this.name = name || '';
    }
}