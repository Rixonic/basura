import { Config } from '../models';

interface ConfigAttributes {
    _id:number;
    parameter: string;
    value:string;
}

export const getEmail = async(  ) => {

    const response: ConfigAttributes | null = await Config.findOne({ where: {parameter: "MAIL"} });
    if ( response ) {
        return response.value;
    }
    return null;

}