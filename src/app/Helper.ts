export class Helper{

    /** Разница между датами */
    public static betweenDate(date1: number, date2: number): string{
        let minDate = date1;
        let maxDate = date2;

        if(date1 > date2){
            maxDate = date1;
            minDate = date2;
        }

        const newDate = new Date(maxDate - minDate);
        const dateInit = new Date(0);

        let res = '';

        //year
        const difYears = newDate.getUTCFullYear() - dateInit.getUTCFullYear();
        if(difYears){
            res += difYears + 'г. ';
        }

        //month
        const difMonths = newDate.getUTCMonth() - dateInit.getUTCMonth();
        if(difMonths){
            res += difMonths + 'мес. ';
        }

        //day
        const difDays = newDate.getUTCDate() - dateInit.getUTCDate();
        if(difDays){
            res += difDays + 'дн. ';
        }

        //hour
        const difHours = newDate.getUTCHours() - dateInit.getUTCHours();
        if(difHours){
            res += difHours + 'ч. ';
        }

        //minutes
        const difMinutes = newDate.getUTCMinutes() - dateInit.getUTCMinutes();
        if(difMinutes){
            res += difMinutes + 'м. ';
        }

        //seconds
        const difSeconds = newDate.getUTCSeconds() - dateInit.getUTCSeconds();
        if(difSeconds){
            res += difSeconds + 'сек. ';
        }

        return res;
    }

    /** Формат числа xx (для даты) */
    public static twoZero(i: number): string {
        return i < 10 ? '0' + i : i + '';
    }

    /** Uid */
    public static generateUid(): string{
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            let r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    /** Clone deep */
    public static clone(object: any): any{
        return JSON.parse(JSON.stringify(object));
    }
}
