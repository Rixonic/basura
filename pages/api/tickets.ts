import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL || '' );

import { ITicket } from '../../interfaces/tickets';
import { Ticket } from '../../models';
import { templateConstance } from '../../utils/templates/template';
import puppeteer from 'puppeteer';
import fs from 'fs';
import { getEmail } from '../../database/dbConfig';

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
    
    const tickets = await Ticket.findAll({order:[['_id','DESC']]})

    res.status(200).json( tickets );
}



const updateTickets = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    console.log(req.body)
    // Verificar si el ID del ticket está presente
    if (!req.body._id) {
      return res.status(400).json({ message: 'El ID del ticket es necesario para la actualización' });
    }

    // Buscar el ticket en la base de datos
    const ticket = await Ticket.findByPk(req.body._id);

    // Verificar si el ticket existe
    if (!ticket) {
      return res.status(404).json({ message: 'El ticket no existe' });
    }

    // Actualizar el ticket con los datos de la solicitud
    const a = await ticket.update(req.body);

    //console.log(a)

    // Confirmar la actualización
    res.status(200).json({ message: 'El ticket se ha actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el ticket:', error);
    res.status(500).json({ message: 'Se produjo un error al intentar actualizar el ticket' });
  }
};


const createTickets = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    try {
        const ticket = await Ticket.create(req.body);
        const response = await ticket.save(); 
        const mail = await getEmail()
        const pdfBuffer = await generatePDF(ticket)
        const mailToUser = await sendMailNotification(ticket.email,ticket)
        await sendMail(pdfBuffer,mail,"OT"+ticket._id+".pdf",ticket._id)
        
        let message;
        if (mailToUser) {
          message = "El ticket se ha creado correctamente, le enviamos un correo con los detalles.";
        } else {
            message = "El ticket se ha creado correctamente, pero no se pudo enviar el correo .";
        }


        res.status(201).json( {message} );



    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Lo sentimos, pero tuvimos un problema' });
     }

}


const sendMail = async (pdfBuffer,destination,filename,id) => {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
          user: 'notificaciones@frank4.com.ar', // Tu dirección de correo electrónico
          pass: 'Hash1722!', // Tu contraseña de correo electrónico
        },
      });
  
      const mailOptions = {
        from: 'notificaciones@frank4.com.ar',
        to: destination,
        subject: `Orden de trabajo N-${id} creada`,
        text: `Se ha creado una nueva OT a partir de la solicitud recibida`,
        attachments: [
          {
              filename: filename || 'OT.pdf',
              content: pdfBuffer, // Contenido del PDF en forma de buffer
          }
      ]
      };
  
      const info = await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      return false;
    }
  };


  const sendMailNotification = async (destination,ticket) => {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
          user: 'notificaciones@frank4.com.ar', // Tu dirección de correo electrónico
          pass: 'Hash1722!', // Tu contraseña de correo electrónico
        },
      });
  
      const mailOptions = {
        from: 'notificaciones@frank4.com.ar',
        to: destination,
        subject: 'Nueva solicitud creada',
        text:`Su solicitud ha sido creada.:
        Nombre del responsable: ${ticket.name}
        Sector: ${ticket.sector}
        Sub sector: ${ticket.subSector}
        Descripcion: ${ticket.description}
        Prioridad: ${ticket.priority}`,
      };
  
      const info = await transporter.sendMail(mailOptions);

      return true;
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      return false;
    }
  };

  
  // Función para convertir una imagen a base64
  function imageToBase64(imagePath) {
      const image = fs.readFileSync(imagePath);
      return Buffer.from(image).toString('base64');
  }
  
  const generatePDF = async  (body) => {
  
      // Reemplazar variables en la plantilla con valores del cuerpo de la solicitud
      const replacedHtml = templateConstance.replace(/{{\s*([^}]+)\s*}}/g, (match, variable) => {
          return body[variable.trim()] || '';
      });
  
      try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
  
          // Convertir las imágenes a base64
          const logoBase64 = imageToBase64(process.env.IMAGE_ROUTE);
          //const logoBase64 = imageToBase64(`/var/www/LogoMyLV.png`);
          // Reemplazar las rutas de las imágenes con las bases64 en la plantilla HTML
          const htmlWithBase64Images = replacedHtml
              .replace('./Logo Hospital San Juan de Dios -Original-.png', `data:image/png;base64,${logoBase64}`)
  
          await page.goto('about:blank');
          await page.setContent(htmlWithBase64Images, { waitUntil: 'domcontentloaded' });
  
          // Generar el PDF
          const pdfBuffer = await page.pdf({
              format: 'A4',
              printBackground: true
          });
  
          await browser.close();
  
          // Enviar el PDF como respuesta

          return (pdfBuffer);
      } catch (error) {
          console.error('Error generando el PDF:', error);

      }
  };