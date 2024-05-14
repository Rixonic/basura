import { IUser } from '../interfaces';
import { DataTypes, Model, Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.POSTGRE_DB, process.env.POSTGRE_USERNAME, process.env.POSTGRE_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    logging: false

});

interface UserInstance extends Model<IUser>, IUser { }

const User = sequelize.define<UserInstance>('User', {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING, //TECNICO - SUPERVISOR - COORDINADOR - JEFE DE DEPARTARMENTO
        defaultValue:"ADMIN"
    }
}, {
    tableName: 'Users'
});

{User.sync()}


export default User;