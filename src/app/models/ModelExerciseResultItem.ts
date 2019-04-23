/**
 * Подход - один из результатов упражнения
 */
export class ModelExerciseResultItem{
    timeStart: Date; //Время начала подхода
    timeEnd: Date; //Время окончания подхода
    count: number; //Количество сделанного (15 подъёмов штанги)
    mass: number; //Масса каждого сделанного раза (30 кг)

    constructor(){
        this.timeStart = new Date();
    }
}