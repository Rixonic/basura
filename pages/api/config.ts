import type { NextApiRequest, NextApiResponse } from 'next'

import { Config } from '../../models';

interface ConfigData {
  parameter: string;
  value: string;
}

type Data = 
| { message: string }
| ConfigData[]
| ConfigData;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getConfig( req, res );
            
        case 'PUT':
            return updateConfig(req, res);

        case 'POST':
            return createConfig( req, res )
            
        default:
            return res.status(400).json({ message: 'Bad request' });
    }
    
 
}

const getConfig = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

}


const updateConfig = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    console.log(req.body)
 try {
        const { parameter, value }: ConfigData = req.body;
        if (!parameter || !value) {
            return res.status(400).json({ message: 'Missing parameter or value' });
        }

        // Buscar y actualizar la configuración en la base de datos
        const config = await Config.findOne({ where: { parameter } });
        if (!config) {
            await Config.create({parameter:parameter,value:value})
            return res.status(200).json({ message: 'Configuracion creada' });
        }

        await config.update({ value });

        return res.status(200).json({ message: 'Configuration updated successfully' });
    } catch (error) {
        console.error('Error updating configuration:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const createConfig = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
 
}

