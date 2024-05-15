import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL || '' );

import { db } from '../../database';
import { ITicket } from '../../interfaces/tickets';
import { Ticket } from '../../models';
import { templateConstance } from '../../utils/templates/template';
import puppeteer from 'puppeteer';
import fs from 'fs';

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
};


const createTickets = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    try {
        const ticket = await Ticket.create(req.body);
        const response = await ticket.save(); 
        console.log(response)
        const pdfBuffer = await generatePDF(ticket)
        const mailToUser = await sendMailNotification(ticket.email)
        await sendMail(pdfBuffer,"franco.j.cejas@gmail.com","OT"+ticket._id+".pdf")
        
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


const sendMail = async (pdfBuffer,destination,filename) => {
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
        subject: 'Nuevo ticket creado',
        text: `Se ha creado un nuevo ticket`,
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


  const sendMailNotification = async (destination) => {
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
        text: `Su solicitud ha sido creada`,
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
          const logoBase64 = imageToBase64(`C:\\signature\\logoSJD.png`);
          //const logoBase64 = imageToBase64(`/var/www/`);
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