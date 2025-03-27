import {OfferService} from './offer-service.interface.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/component.enum.js';
import {Logger} from '../../libs/logger/logger.interface.js';
import {types} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto) {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async updateById(offerId: string, dto: CreateOfferDto) {
    const result = await this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['userId']);

    if (!result) {
      return null;
    }

    return result;
  }

  public async deleteById(offerId: string): Promise<void> {
    await this.offerModel.findByIdAndDelete(offerId);
  }

  public async findOfferList() {
    return this.offerModel.aggregate([
      {
        $lookup: {
          from: 'comments',
          let: { offerId: '$_id' },
          pipeline: [
            { $match: { offer: '$$offerId' } },
            { $project: { rating: 1 } },
          ],
          as: 'comments',
        },
      },
      {
        $addFields: {
          id: { $toString: '$_id' },
          commentsCount: { $size: '$comments' },
          rating: { $avg: '$comments.rating' },
        },
      },
    ]);
  }

  public async findById(offerId: string) {
    return this.offerModel
      .findById(offerId)
      .populate('userId')
      .exec();
  }

  public async findPremiumOfferList(cityId: string) {
    return this.offerModel
      .find({ cityId, isPremium: true })
      .populate(['userId']);
  }

  public async findFavoritesOfferList() {
    return this.offerModel
      .find({ isFavorites: true })
      .populate(['userId']);
  }

  public async addOfferToFavorites(offerId: string) {
    return this.offerModel.findByIdAndUpdate(offerId, { $set: { isFavorites: true } }, { new: true });
  }

  public async deleteOfferFromFavorites(offerId: string) {
    return this.offerModel.findByIdAndUpdate(offerId, { $set: { isFavorites: false } }, { new: true });
  }

  public async exists(offerId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: offerId })) !== null;
  }
}
