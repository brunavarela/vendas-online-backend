import { IsNumber } from "class-validator";

export class InserCartDTO {
  @IsNumber()
  productId: number;

  @IsNumber()
  amount: number;
}