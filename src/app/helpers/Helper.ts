import { ElementRef } from '@angular/core';

export class Helper{

    /** Разница между датами */
    public static betweenDate2(date1: number, date2: number, isFullFormat = true): string{
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

    /** Разница между датами */
    public static betweenDate(date1: number, date2: number, isFullFormat = true): string{
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
        const difMonths = newDate.getUTCMonth() - dateInit.getUTCMonth();
        if(difYears){
            res += difYears;
            res += isFullFormat || !difMonths ? '' : (difMonths / 12).toFixed(1).substr(1);
            res += 'г. ';

            if(!isFullFormat){
                return res;
            }
        }

        //month
        const difDays = newDate.getUTCDate() - dateInit.getUTCDate();
        if(difMonths){
            res += difMonths;
            res += isFullFormat || !difDays ? '' : (difDays / 31).toFixed(1).substr(1);
            res += 'мес. ';

            if(!isFullFormat){
                return res;
            }
        }

        //day
        const difHours = newDate.getUTCHours() - dateInit.getUTCHours();
        if(difDays){
            res += difDays;
            res += isFullFormat || !difHours ? '' : (difHours / 24).toFixed(1).substr(1);
            res += 'дн. ';

            if(!isFullFormat){
                return res;
            }
        }

        //hour
        const difMinutes = newDate.getUTCMinutes() - dateInit.getUTCMinutes();
        if(difHours){
            res += difHours;
            res += isFullFormat || !difMinutes ? '' : (difMinutes / 60).toFixed(1).substr(1);
            res += 'ч. ';

            if(!isFullFormat){
                return res;
            }
        }

        //minutes
        const difSeconds = newDate.getUTCSeconds() - dateInit.getUTCSeconds();
        if(difMinutes){
            res += difMinutes;
            res += isFullFormat || !difSeconds ? '' : (difSeconds / 60).toFixed(1).substr(1);
            res += 'м. ';

            if(!isFullFormat){
                return res;
            }
        }

        //seconds
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
        if(object === undefined){
            return null;
        }
        return JSON.parse(JSON.stringify(object));
    }

    /** Get Url Parameters */
    public static getUrlParameters(): any{
        let result = {};

        if(!location.search || !location.search.length){
            return result;
        }

        location.search
            .substr(1)
            .split('&')
            .forEach(x => {
                let parts = x.split('=');
                if(parts.length == 2){
                    result[parts[0]] = parts[1];
                }
            });

        return result;
    }

    /** Get Element Compared Parameters in one string */
    public static getElementHash(ref: ElementRef): string{
        let el = ref.nativeElement;
        if(!el){
            return '';
        }
        
        return [el.offsetLeft, el.offsetTop, el.offsetWidth, el.offsetHeight].join('|');
    }
}
