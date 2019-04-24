import { ModelExerciseResult } from './ModelExerciseResult';
import { ModelTypeExercise } from './ModelTypeExercise';

/**
 * Результат упражнения
 */
export class ModelExerciseResults{
    dateSave: Date; //Дата сохранения модели
    exerciseTypes: ModelTypeExercise[]; //типы упражнений
    data: ModelExerciseResult[]; //упражнения

    constructor(){
        this.dateSave = new Date();
        this.exerciseTypes = [];
        this.data = [];
    }
}