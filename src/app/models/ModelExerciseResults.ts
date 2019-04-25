import { ModelExerciseResult } from './ModelExerciseResult';
import { ModelTypeExercise } from './ModelTypeExercise';

/**
 * Результат упражнения
 */
export class ModelExerciseResults{
    dateSave: number; //Дата сохранения модели (unixTime)
    exerciseTypes: ModelTypeExercise[]; //типы упражнений
    data: ModelExerciseResult[]; //упражнения

    constructor(){
        this.dateSave = 0;
        this.exerciseTypes = [];
        this.data = [];
    }
}