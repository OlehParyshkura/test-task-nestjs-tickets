import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateGlobalParameterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDefined()
  value: any;
}
