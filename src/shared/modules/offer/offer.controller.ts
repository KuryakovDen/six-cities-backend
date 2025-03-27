import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { inject } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { OfferService } from './offer-service.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDTO } from '../../helpers/fillDTO.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { Request, Response } from 'express';

export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/premium/:cityId', method: HttpMethod.Get, handler: this.getPremium });
    this.addRoute({ path: '/create', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.getDetailOfferInfo });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Put, handler: this.update });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.getFavorites });
    this.addRoute({ path: '/:offerId/favorites', method: HttpMethod.Post, handler: this.addToFavorites });
    this.addRoute({ path: '/:offerId/favorites', method: HttpMethod.Delete, handler: this.deleteFromFavorites });
  }

  public async index(_req: Request, res: Response) {
    const offers = await this.offerService.findOfferList();
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async getPremium(
    { params }: Request,
    res: Response
  ) {
    const premiumOffers = await this.offerService.findPremiumOfferList(params.cityId);
    this.ok(res, fillDTO(OfferRdo, premiumOffers));
  }

  public async create(
    { body }: Request,
    res: Response,
  ) {
    const newOffer = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, newOffer));
  }

  public async getDetailOfferInfo(
    { params }: Request,
    res: Response
  ) {
    const offer = await this.offerService.findById(params.offerId);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update(
    { params, body }: Request,
    res: Response
  ) {
    const offer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async delete(
    { params }: Request,
    res: Response,
  ) {
    await this.offerService.deleteById(params.offerId);
    this.noContent(res, { message: 'Offer deleted successfully' });
  }

  public async getFavorites(
    _req: Request,
    res: Response
  ) {
    const favorites = await this.offerService.findFavoritesOfferList();
    this.ok(res, fillDTO(OfferRdo, favorites));
  }

  public async addToFavorites(
    { params }: Request,
    res: Response
  ) {
    const updatedOffer = await this.offerService.addOfferToFavorites(params.offerId);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async deleteFromFavorites(
    { params }: Request,
    res: Response
  ) {
    await this.offerService.deleteOfferFromFavorites(params.offerId);
    this.noContent(res, { message: 'Offer deleted from favorites successfully' });
  }
}
