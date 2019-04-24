import { ModelExerciseResultItem } from './ModelExerciseResultItem';
import { ModelTypeExercise } from './ModelTypeExercise';

/**
 * Результат упражнения
 */
export class ModelExerciseResult{
    date: Date; //Дата начала тренировки
    type: ModelTypeExercise; //тип тренировки
    results: ModelExerciseResultItem[]; //Подходы (результаты упражнения)

    constructor(type: ModelTypeExercise, approachExercise: ModelExerciseResultItem[]){
        this.date = new Date();
        this.type = type;
        this.results = approachExercise || [];
    }
}