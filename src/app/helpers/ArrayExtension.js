export class ArrayExtension{
    static on(){
        // Прокачка массива - функция sum: [23, -11, 0, 7].sum() = 23 - 11 + 0 + 7 = 27
        // [{type: '...', int: 12}, {type: '...', int: -7}, {type: '...', int: 3}].sum(x => x.int) = 12 - 7 + 3 = 8
        // [].sum() = 0
        if (!Array.prototype.sum) {
            Array.prototype.sum = function(fun) {
                let sum = 0;
                if(fun){
                    this.map(x => sum += parseFloat(fun(x)));
                }
                else{
                    this.map(x => sum += parseFloat(x));
                }

                return sum;
            };
        }

        // Прокачка массива - функция count:
        // [{type: '...', int: 12}, {type: '...', int: -7}, {type: '...', int: 3}].count(x => x.int > 0) = 2
        if (!Array.prototype.count) {
            Array.prototype.count = function(fun) {
                if(!fun){
                    return this.length;
                }

                let count = 0;
                this.map(x => {
                    if(fun(x)){
                        count++;
                    }
                });
                return count;
            };
        }

        // Прокачка массива - функция avr:
        // [{type: '...', int: 12}, {type: '...', int: -7}, {type: '...', int: 4}].count(x => x.int) = (12 -7 + 4) / 3 = 3
        // [234, 574, 23].avr() = (234 + 574 + 23) / 3 = 277
        if (!Array.prototype.avr) {
            Array.prototype.avr = function(fun) {
                if(!fun){
                    return this.sum() / this.length;
                }

                return this.map(x => fun(x)).sum() / this.length;
            };
        }

        // Прокачка массива - функция max:
        // [{type: '...', int: -7}, {type: '...', int: 12}, {type: '...', int: 4}].max(x => x.int) = {type: '...', int: 12}
        // [234, 574, 23].max() = 574
        if (!Array.prototype.max) {
            Array.prototype.max = function(fun) {
                if(this.length === 0){
                    return Math.NaN;
                }

                if(fun){
                    let maxValue = fun(this[0]);
                    let maxEl = this[0];

                    this.map(x => {
                        if(fun(x) > maxValue){
                            maxValue = fun(x);
                            maxEl = x;
                        }
                    });

                    return maxEl
                }

                let max = this[0];
                this.map(x => {
                    if(x > max){
                        max = x;
                    }
                });
                return max;
            };
        }
        // Прокачка массива - функция min:
        // [{type: '...', int: 12}, {type: '...', int: -7}, {type: '...', int: 4}].min(x => x.int) = {type: '...', int: -7}
        // [234, 574, 23].min() = 23
        if (!Array.prototype.min) {
            Array.prototype.min = function(fun) {
                if(this.length === 0){
                    return Math.NaN;
                }

                if(fun){
                    let minValue = fun(this[0]);
                    let minEl = this[0];

                    this.map(x => {
                        if(fun(x) < minValue){
                            minValue = fun(x);
                            minEl = x;
                        }
                    });

                    return minEl
                }

                let min = this[0];
                this.map(x => {
                    if(x < min){
                        min = x;
                    }
                });
                return min;
            };
        }

        // Прокачка массива - функция last:
        // [{type: '...', int: 12}, {type: '...', int: -7}, {type: '...', int: 3}].last() = {type: '...', int: 3}
        // [234, 634, 11].last() = 11
        if (!Array.prototype.last) {
            Array.prototype.last = function() {
                return this[this.length - 1];
            };
        }

        // Прокачка массива - функция sortByField: добавлена возможность сортировки по 1 параметру:
        //1-1 вариант: [{type: '...', int: 12}, {type: '...', int: -7}, {type: '...', int: 3}].sortByField(x => x.int) = [{type: '...', int: -7}, {type: '...', int: 3}, {type: '...', int: 12}]
        //2-1 вариант: [{type: '...', int: 12}, {type: '...', int: -7}, {type: '...', int: 3}].sortByField('int') = [{type: '...', int: -7}, {type: '...', int: 3}, {type: '...', int: 12}]
        if (!Array.prototype.sortByField) {
            Array.prototype.sortByField = function(fun) {
                if(typeof fun === 'function'){
                    return this.sort((a, b) => {
                        if(fun(a) > fun(b)){
                            return 1;
                        }

                        if(fun(a) < fun(b)){
                            return -1;
                        }

                        return 0;
                    });
                }
                else if(typeof fun === 'string'){
                    return this.sortByField(x => x[fun]);
                }
            };
        }

        // Прокачка массива - функция clone: клонирование значений
        //var a1 = [123, 6346, 74, 12];
        //var a2 = a1.clone();
        //a2[2] = 555;
        //console.log(a1) = [123, 6346, 74, 12]
        //console.log(a2) = [123, 6346, 555, 12]
        if (!Array.prototype.clone) {
            Array.prototype.clone = function() {
                const newArray = [];

                this.map(el => newArray.push(el));

                return newArray;
            };
        }

        // Прокачка массива - функция cloneDeep: глубокое клонирование значений
        //var a1 = [{a: 24, c: 88}, {a: 11, c: 6585}];
        //var a2 = a1.cloneDeep();
        //a2[1]['c'] = 555;
        //console.log(a1) = [{a: 24, c: 88}, {a: 11, c: 6585}]
        //console.log(a2) = [{a: 24, c: 88}, {a: 11, c: 555}]
        if (!Array.prototype.cloneDeep) {
            Array.prototype.cloneDeep = function () {
                return JSON.parse(JSON.stringify(this));
            };
        }

    }
}