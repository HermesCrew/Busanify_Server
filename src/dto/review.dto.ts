import { ApiProperty } from '@nestjs/swagger';

export class ReviewDto {
  @ApiProperty({ example: 'PLACE_ID' })
  placeId: string;

  @ApiProperty({ example: 5 })
  rating: number;

  @ApiProperty({ example: '리뷰 내용' })
  content: string;

  @ApiProperty({ example: ['imageURL_1, imageURL_2, imageURL_3'] })
  photoUrls: string[];
}

export class ReviewUpdateDto {
  @ApiProperty({ example: 'REVIEW_ID' })
  id: number;

  @ApiProperty({ example: 5 })
  rating: number;

  @ApiProperty({ example: '리뷰 내용' })
  content: string;

  @ApiProperty({ example: ['imageURL_1, imageURL_2, imageURL_3'] })
  photoUrls: string[];
}

export class ReviewDeleteDto {
  @ApiProperty({ example: 'REVIEW_ID' })
  id: string;
}
