import { ModelExerciseResultItem } from './ModelExerciseResultItem';

/**
 * Результат упражнения
 */
export class ModelExerciseResult{
    date: Date; //Дата начала тренировки
    type: String; //тип тренировки
    results: ModelExerciseResultItem[]; //Подходы (результаты упражнения)

    constructor(type = '', approachExercise = []){
        this.date = new Date();
        this.type = type;
        this.results = approachExercise || [];
    }
}