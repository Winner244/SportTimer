export class Helper{

    /**
     * Парсит строку даты в тип JS Date
     * @param {string|Date} dateTime
     * @return {Date}
     */
    static parseDateTime(dateTime){
        const d =  new Date(dateTime);
        if(Date.parse(dateTime) || !isNaN(d.getTime())){
            return new Date(dateTime);
        }

        if(dateTime === null || dateTime === 'null' || dateTime === '' || !dateTime){
            return null;
        }

        const dateJs = new Date();

        const dateTimePart = dateTime.split(' ');
        let datePart = null;

        //ищем разделительный знак
        for(let i = 1; i < dateTimePart[0].length - 1; i++){
            if(parseInt(dateTimePart[0][i]) + '' !== dateTimePart[0][i]){
                datePart = dateTimePart[0].split(dateTimePart[0][i]);
                break;
            }
        }

        //set date
        if((datePart[0] + '').length === 4){
            dateJs.setYear(datePart[0]);
            dateJs.setMonth(parseInt(datePart[1]) - 1);
            dateJs.setDate(datePart[2]);
        }
        else {
            let year = datePart[2];
            if(year.length === 2){
                year = (new Date()).getYear().toString().substr(0, 2) + year;
            }
            dateJs.setYear(year);
            dateJs.setMonth(parseInt(datePart[1]) - 1);
            dateJs.setDate(datePart[0]);
        }

        //set time
        const timePart = dateTimePart[1].split(':');
        timePart[timePart.length - 1] = timePart[timePart.length - 1].split(' ')[0];
        dateJs.setHours(timePart[0]);
        dateJs.setMinutes(timePart[1]);
        if(timePart.length > 2){
            dateJs.setSeconds(timePart[2]);
        }

        return dateJs;
    }

    /**
     * Получить текущее время в формате y.m.d h:i:s
     * @param {string|Date|number} dateTime - время и дата
     * @param {boolean} isWithoutUTC - без часового пояса?
     * @return {string}
     * @testOk
     */
    static getDate(dateTime = null, isWithoutUTC = false) {
        let t = new Date();
        if(dateTime){
            t = Helper.parseDateTime(dateTime);
        }

        if(!t){
            return '';
        }

        if(isWithoutUTC){
            return this.twoZero(t.getUTCDate()) + '.' + this.twoZero(t.getUTCMonth() + 1) + '.' + t.getUTCFullYear() + ' ' +
                this.twoZero(t.getUTCHours()) + ':' + this.twoZero(t.getUTCMinutes()) + ':' + this.twoZero(t.getUTCSeconds());
        }

        return this.twoZero(t.getDate()) + '.' + this.twoZero(t.getMonth() + 1) + '.' + t.getFullYear() + ' ' +
            this.twoZero(t.getHours()) + ':' + this.twoZero(t.getMinutes()) + ':' + this.twoZero(t.getSeconds());
    }
    /**
     * Получить текущее время в формате h:i:s
     * @param {string|Date|number} dateTime - время и дата
     * @param {boolean} isWithoutUTC - без часового пояса?
     * @return {string}
     * @testOk
     */
    static getTime(dateTime = null, isWithoutUTC = false) {
        let t = new Date();
        if(dateTime){
            t = Helper.parseDateTime(dateTime);
        }

        if(!t){
            return '';
        }

        if(isWithoutUTC){
            return this.twoZero(t.getUTCHours()) + ':' + this.twoZero(t.getUTCMinutes()) + ':' + this.twoZero(t.getUTCSeconds());
        }

        return this.twoZero(t.getHours()) + ':' + this.twoZero(t.getMinutes()) + ':' + this.twoZero(t.getSeconds());
    }

    /**
     * Разница между датами
     * @param {string|Date|number} date1
     * @param {string|Date|number} date2
     * @return {string}
     */
    static betweenDate(date1, date2){
        let maxDate = this.parseDateTime(date1);
        let minDate = this.parseDateTime(date2);

        if(minDate > maxDate){
            let tempDate = maxDate;
            maxDate = minDate;
            minDate = tempDate;
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

    /**
     * Формат числа xx (для даты)
     * @param i {number}
     * @return {string}
     * @testOk
     */
    static twoZero(i) {
        i = parseInt(i);
        return i < 10 ? '0' + i : i;
    }

    /**
     * Uid
     * @return {string}
     * @testOk
     */
    static generateUid(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            let r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    /**
     * Clone deep
     * @param {any} object
     * @returns {any}
     */
    static clone(object){
        return JSON.parse(JSON.stringify(object));
    }
}
