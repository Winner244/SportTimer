export class StringExtension{
    static on(){
        // Прокачка строки - функция format: 'Покупай машину {0} за {1} рублей'.format('mustang', 3100200);
        if (!String.prototype.format) {
            String.prototype.format = function() {
                const args = arguments;
                return this.replace(/{(\d+)}/g, (match, number) => {
                    if(args[number] === null){
                        return 'null';
                    }
                    if(args[number] && args[number].className){
                        return args[number].className();
                    }
                    if(typeof args[number] === 'undefined'){
                        return match;
                    }
                    if(typeof args[number] === 'object'){
                        if(args[number].toObject){
                            return args[number].toObject();
                        }
                        return JSON.stringify(args[number]);
                    }
                    return args[number];
                });
            };
        }
    }
}