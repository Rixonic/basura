import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

import { db } from '../../../database';
import { User } from '../../../models';
import { jwt } from '../../../utils';

type Data = 
| { message: string }
| {
    token: string;
    user: {
        username: string;
        name: string;
        role: string;

    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'POST':
            return loginUser(req, res)

        default:
            res.status(400).json({
                message: 'Bad request'
            })
    }
}

const loginUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { username = '', password = ''  } = req.body;

    //await db.connect();
    const user = await User.findOne({where: {username:username} });
    console.log("User del get: ", user)
    //await db.disconnect();

    if ( !user ) {
        return res.status(400).json({ message: 'Correo o contraseña no válidos - EMAIL' })
    }
    
    if ( !bcrypt.compareSync( password, user.password! ) ) {
        return res.status(400).json({ message: 'Correo o contraseña no válidos - Password' })
    }

    const {  role, name, _id} = user;

    const token = jwt.signToken( _id, username );

    return res.status(200).json({
        token, //jwt
        user: {
           username, role, name
        }
    })


}
