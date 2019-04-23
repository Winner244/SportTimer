export class ModelGoogleUser{
    email: string;

    constructor(data: any = ''){
        if(typeof data === 'string'){
            this.email = data;
        }
        else if(data && typeof data === 'object' && 'email' in data){
            this.email = data.email;
        }
    }
}