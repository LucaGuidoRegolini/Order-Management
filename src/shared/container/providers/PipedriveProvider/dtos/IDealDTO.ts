export interface IDealDTO {
  id: number;
  title: string;
  value: number;
  product_count: number;
  client_id: number;
  client_name: string;
  client_email: string[];
  user_id: number;
  deal_date: Date;
}
