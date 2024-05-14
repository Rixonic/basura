import bcrypt from 'bcryptjs';

import { User } from '../models';
import { db } from '.';

export const checkUserEmailPassword = async( username: string, password: string ) => {
    console.log("Marianito")
    //await db.connect();
    const user = await User.findOne({ where: {username:username} });
    //await db.disconnect();

    if ( !user ) {
        return null;
    }

    if ( !bcrypt.compareSync( password, user.password! ) ) {
        return null;
    }

    const { role, name, _id } = user;

    return {
        _id,
        username: username.toLocaleLowerCase(),
        role,
        name
    }
}


// Esta función crea o verifica el usuario de OAuth
/*
export const oAUthToDbUser = async( oAuthEmail: string, oAuthName: string ) => {
    console.log("Manuelita")
    await db.connect();
    const user = await User.findOne({ email: oAuthEmail });
    console.log("Sera este login?:",user)
    if ( user ) {
        await db.disconnect();
        const { _id, name, email, role } = user;
        return { _id, name, email, role };
    }

    const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: 'visitante'  });
    await newUser.save();
    await db.disconnect();

    const { _id, name, username role } = newUser;
    return { _id, name, username, role };

}*/

export const getUserData = async( username: string ) => {
    console.log("Miguel")
    //await db.connect();
    const user = await User.findOne({ where: {username: username} });
    if ( user ) {
        //await db.disconnect();
        const { _id, name, username, role} = user;
        return { _id, name, username, role };
    }

    //await db.disconnect();

    return null;

}