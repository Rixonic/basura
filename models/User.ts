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
    email: {
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

    },
    locations: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    }, // Los servicios habilitados
    sede: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    }, // Sedes habilitadas
    sector: {
        type: DataTypes.STRING, // ['ingenieria','instalaciones','electromedicina','SeH','neonatologia','uti','consultorios','quirofano','imagenes','endoscopia','hemodinamia','internacion','pendiente'],

    }
}, {
    tableName: 'Users'
});

{User.sync()}


export default User;