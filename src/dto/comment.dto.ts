import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({ example: 'POST_ID' })
  postId: number;

  @ApiProperty({ example: '리뷰 내용' })
  content: string;
}
