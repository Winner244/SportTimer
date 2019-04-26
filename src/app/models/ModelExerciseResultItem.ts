/**
 * Подход - один из результатов упражнения
 */
export class ModelExerciseResultItem{
    timeStart: number; //Время начала подхода (unixTime)
    timeEnd: number; //Время окончания подхода (unixTime)
    count: number; //Количество сделанного (15 подъёмов штанги)
    mass: number; //Масса каждого сделанного раза (30 кг)

    constructor(){
        this.timeStart = Date.now();
    }
}