import { Helper } from '../Helper';

/**
 * Тип упражнения
 */
export class ModelTypeExercise{
    uid: string;
    name: string;

    constructor(name: string, uid: string = ''){
        this.uid = uid || Helper.generateUid();
        this.name = name || '';
    }
}