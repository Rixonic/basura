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
        const response = await ticket.save(); 
        console.log(response)
        const pdfBuffer = await generatePDF(ticket)
        sendMail(pdfBuffer,"franco.j.cejas@gmail.com","OT"+ticket._id+".pdf")
        sendMailNotification(ticket.email)
        res.status(201).json( ticket );
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar logs del servidor' });
     }

}


const sendMail = async (pdfBuffer,destination,filename) => {
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
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  };


  const sendMailNotification = async (destination) => {
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
        to: destination,
        subject: 'Nueva solicitud creada',
        text: `Su solicitud ha sido creada`,
      };
  
      const info = await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
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