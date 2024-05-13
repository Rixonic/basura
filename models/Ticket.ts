import { Sequelize, DataTypes, Model } from "sequelize";
import {  ITicket } from "../interfaces";

const sequelize = new Sequelize(process.env.POSTGRE_DB, process.env.POSTGRE_USERNAME, process.env.POSTGRE_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

interface TicketInstance extends Model<ITicket>, ITicket { }

const Ticket = sequelize.define<TicketInstance>('Ticket', {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    priority: {
        type: DataTypes.STRING,
        validate: {
            isIn: [['ALTO', 'MEDIO', 'BAJO']]
        },
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sector: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subSector: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    tableName: 'Tickets'
});

Ticket.sync()

export default Ticket;