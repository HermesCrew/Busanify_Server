import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty({ example: '게시물 내용' })
  content: string;

  @ApiProperty({ example: ['imageURL_1, imageURL_2, imageURL_3'] })
  photos: string[];
}
