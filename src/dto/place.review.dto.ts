export class PlaceInReviewDto {
  id: string;

  image: string;

  title: string;
}

export class ReviewForUserDto {
  id: string;

  rating: number;

  content: string;

  photoUrls: [string];

  createdAt: Date;

  place: PlaceInReviewDto;
}
