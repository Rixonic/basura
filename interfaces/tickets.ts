
export interface ITicket {
    _id?: number;
    email: string;
    name: string;
    description: string;
    sector: string;
    subSector: string;
    priority: string;
    images:string[];
  }

export interface IDiagonstic{
    user : string;
    observation : string;
}
