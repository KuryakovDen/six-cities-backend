import {Response, Router} from 'express';
import {Route} from '../types/route.interface.js';
import {OfferRdo} from '../../../modules/offer/rdo/offer.rdo.js';

export interface Controller {
  readonly router: Router;
  addRoute: (route: Route) => void;
  send: <T>(res: Response, statusCode: number, data: T) => void;
  ok: <T>(res: Response, data: OfferRdo[]) => void;
  created: <T>(res: Response, data: T) => void;
  noContent: <T>(res: Response, data: T) => void;
}
