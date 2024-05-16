import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

import { User } from '../../../models';
import { jwt, validations } from '../../../utils';

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
            return registerUser(req, res)

        default:
            res.status(400).json({
                message: 'Bad request'
            })
    }
}

const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { username = '', password = '', name = '' } = req.body as {username: string, password: string, name: string };

    if ( password.length < 6 ) {
        return res.status(400).json({
            message: 'La contraseña debe de ser de 6 caracteres'
        });
    }

    if ( name.length < 2 ) {
        return res.status(400).json({
            message: 'El nombre debe de ser de 2 caracteres'
        });
    }
    /*
    if ( !validations.isValidEmail( email ) ) {
        return res.status(400).json({
            message: 'El correo no tiene formato de correo'
        });
    }*/
    
    
    const user = await User.findOne({ where:{ username:username }});

    if ( user ) {
        return res.status(400).json({
            message:'No puede usar ese correo'
        })
    }

    const newUser = await User.create({
        password: bcrypt.hashSync( password ),
        role: req.body.role,
        name: req.body.name,
        username: req.body.username,
    });
   
    const { _id, role } = newUser;

    const token = jwt.signToken( _id, username );

    return res.status(200).json({
        token, //jwt
        user: {
            username, 
            role, 
            name,

        }
    })


}
