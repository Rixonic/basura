
export interface ITicket {
    _id?: number;
    email: string;
    name: string;
    description: string;
    sector: string;
    subSector: string;
    priority: string;
    images:string[];
    reciever: string;
    dateRecieved: Date;
    workHours: Date; 
    executer: string;
    status: string;
    materials: string;
    comments: string;
  }