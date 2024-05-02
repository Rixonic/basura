import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL || '' );

import { db } from '../../database';
import { ITicket } from '../../interfaces/tickets';
import { Ticket } from '../../models';

type Data = 
| { message: string }
| ITicket[]
| ITicket;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getTickets( req, res );
            
            case 'PUT':
                return updateTickets(req, res);

        case 'POST':
            return createTickets( req, res )

        case 'DATE':
                return createTickets( req, res )
            
        default:
            return res.status(400).json({ message: 'Bad request' });
    }
    
 
}

const getTickets = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    await db.connect();

    const tickets = await Ticket.findAll()

    await db.disconnect();


    res.status(200).json( tickets );
}



const updateTickets = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
};


const createTickets = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    console.log(req.body)
    try {
        const ticket = await Ticket.create(req.body);
        await ticket.save(); 
        sendMail(ticket)
        res.status(201).json( ticket );
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar logs del servidor' });
     }

}


const sendMail = async (body) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'Gmail', // Cambia esto al servicio de correo que desees usar
        auth: {
          user: 'frank4notification@gmail.com', // Tu dirección de correo electrónico
          pass: 'vcwc pgkz nmas oovf', // Tu contraseña de correo electrónico
        },
      });
  
      const mailOptions = {
        from: 'frank4notification@gmail.com',
        to: 'franco.j.cejas@gmail.com',
        subject: 'Nuevo ticket creado',
        text: `Se ha creado un nuevo ticket`,
      };
  
      const info = await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  };


