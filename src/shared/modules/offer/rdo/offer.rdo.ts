import {Expose} from 'class-transformer';
import {CityWithCoordinates, Coordinates} from '../../../types/offer.type.js';
import {HousingType} from '../../../types/housing-type.enum.js';
import {ConvenienceType} from '../../../types/convenience-type.enum.js';

export class OfferRdo {
  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public publicationDate: Date;

  @Expose()
  public city: CityWithCoordinates;

  @Expose()
  public previewImage: string;

  @Expose()
  public housingPhotos: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorites: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public housing: HousingType;

  @Expose()
  public roomsCount: number;

  @Expose()
  public guessCount: number;

  @Expose()
  public rentalPrice: number;

  @Expose()
  public conveniences: ConvenienceType[];

  @Expose()
  public commentsCount: number;

  @Expose()
  public coordinates: Coordinates;

  @Expose()
  public userId: string;
}
