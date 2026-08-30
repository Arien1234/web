import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: '请输入用户名' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: '请输入密码' })
  password: string;
}

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: '用户名至少 3 个字符' })
  @MaxLength(50, { message: '用户名过长' })
  username: string;

  @IsString()
  @MinLength(6, { message: '密码至少 6 位' })
  @MaxLength(64, { message: '密码过长' })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: '显示名过长' })
  displayName?: string;
}

export class CreateMemberDto {
  @IsString()
  @MinLength(3, { message: '用户名至少 3 个字符' })
  @MaxLength(50, { message: '用户名过长' })
  username: string;

  @IsString()
  @MinLength(6, { message: '密码至少 6 位' })
  @MaxLength(64, { message: '密码过长' })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: '显示名过长' })
  displayName?: string;
}

export class UpdateMemberDto {
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: '显示名过长' })
  displayName?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: '密码至少 6 位' })
  @MaxLength(64, { message: '密码过长' })
  password?: string;
}

export class InquiryDto {
  @IsString()
  @IsNotEmpty({ message: '请填写姓名' })
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  company?: string;

  @IsString()
  @IsNotEmpty({ message: '请填写需求' })
  @MaxLength(500)
  message: string;
}
