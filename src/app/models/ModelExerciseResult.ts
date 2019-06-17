import { ModelExerciseResultItem } from './ModelExerciseResultItem';

/**
 * Результат упражнения
 */
export class ModelExerciseResult{
    date: number; //Дата начала тренировки (unixTime)
    type: string; //uid типа тренировки
    results: ModelExerciseResultItem[]; //Подходы (результаты упражнения)

    constructor(type: string, approachExercise: ModelExerciseResultItem[] = []){
        this.date = Date.now();
        this.type = type;
        this.results = approachExercise || [];
    }
}