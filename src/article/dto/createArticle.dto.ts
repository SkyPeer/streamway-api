import { IsNotEmpty } from 'class-validator';
// https://www.npmjs.com/package/class-validator
// https://docs.nestjs.com/pipes

export class CreateArticleDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  // @IsOptional()
  // readonly body: string;

  @IsNotEmpty()
  readonly body: string;

  readonly tagList?: string[];
}

// export class UpdateArticleDto {
//     @IsNotEmpty()
//     readonly title: string;
//
//     @IsNotEmpty()
//     readonly description: string;
//
//     @IsNotEmpty()
//     readonly body: string;
//
//     readonly tagList? :string[];
// }
