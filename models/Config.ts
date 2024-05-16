import { IUser } from '../interfaces';
import { DataTypes, Model, Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.POSTGRE_DB, process.env.POSTGRE_USERNAME, process.env.POSTGRE_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    logging: false

});
interface ConfigAttributes {
    _id: number;
    parameter: string;
    value: string;
}

interface ConfigInstance extends Model<ConfigAttributes>, ConfigAttributes {}

const Config = sequelize.define<ConfigInstance>('Config', {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    parameter: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'Config'
});

{Config.sync()}


export default Config;