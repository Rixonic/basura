
export interface ITicket {
    _id?: number;
    email: string;
    name: string;
    description: string;
    sector: string;
    priority: string;
  }

export interface IDiagonstic{
    user : string;
    observation : string;
}
