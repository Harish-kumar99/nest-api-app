import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Mobile number is required' })
  @Matches(/^[0-9]+$/, { message: 'Mobile number must contain only numbers' })
  mobile: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
