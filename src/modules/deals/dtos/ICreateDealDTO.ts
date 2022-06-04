export interface ICreateDealDTO {
  pipedrive_id: number;
  title: string;
  value: number;
  product_count: number;
  client_id: string;
  user_id: string;
  user_pipedrive_id: number;
  deal_date: Date;
}
