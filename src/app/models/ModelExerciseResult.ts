import { ModelExerciseResultItem } from './ModelExerciseResultItem';
import { ModelTypeExercise } from './ModelTypeExercise';

/**
 * Результат упражнения
 */
export class ModelExerciseResult{
    date: number; //Дата начала тренировки (unixTime)
    type: ModelTypeExercise; //тип тренировки
    results: ModelExerciseResultItem[]; //Подходы (результаты упражнения)

    constructor(type: ModelTypeExercise, approachExercise: ModelExerciseResultItem[]){
        this.date = Date.now();
        this.type = type;
        this.results = approachExercise || [];
    }
}