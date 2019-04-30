import { ModelExerciseResultItem } from './ModelExerciseResultItem';
import { ModelTypeExercise } from './ModelTypeExercise';

/**
 * Результат упражнения
 */
export class ModelExerciseResult{
    date: number; //Дата начала тренировки (unixTime)
    type: string; //uid типа тренировки
    results: ModelExerciseResultItem[]; //Подходы (результаты упражнения)

    constructor(type: ModelTypeExercise, approachExercise: ModelExerciseResultItem[]){
        this.date = Date.now();
        this.type = type.uid;
        this.results = approachExercise || [];
    }
}