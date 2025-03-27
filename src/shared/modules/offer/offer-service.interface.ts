import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';

export interface OfferService {
  /**
   * Создает новое предложение.
   * @param dto Данные для создания предложения.
   * @returns Промис с созданным предложением.
   */
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;

  /**
   * Обновляет предложение по его идентификатору.
   * @param offerId Идентификатор предложения.
   * @param dto Данные для обновления предложения.
   * @returns Промис с обновленным предложением или null, если предложение не найдено.
   */
  updateById(offerId: string, dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null>;

  /**
   * Удаляет предложение по его идентификатору.
   * @param offerId Идентификатор предложения.
   * @returns void
   */
  deleteById(offerId: string): Promise<void>;

  /**
   * Возвращает список всех предложений.
   * @returns Промис со списком предложений.
   */
  findOfferList(): Promise<DocumentType<OfferEntity>[]>;

  /**
   * Возвращает предложение по его идентификатору.
   * @param offerId Идентификатор предложения.
   * @returns Промис с предложением или null, если предложение не найдено.
   */
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  /**
   * Возвращает список премиальных предложений для указанного города.
   * @param cityId Id города с координатами.
   * @returns Промис со списком премиальных предложений.
   */
  findPremiumOfferList(cityId: string): Promise<DocumentType<OfferEntity>[]>;

  /**
   * Возвращает список избранных предложений.
   * @returns Промис со списком избранных предложений.
   */
  findFavoritesOfferList(): Promise<DocumentType<OfferEntity>[]>;

  /**
   * Добавляет предложение в избранное.
   * @param offerId Идентификатор предложения.
   * @returns Промис с обновленным предложением или null, если предложение не найдено.
   */
  addOfferToFavorites(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  /**
   * Удаляет предложение из избранного.
   * @param offerId Идентификатор предложения.
   * @returns Промис с обновленным предложением или null, если предложение не найдено.
   */
  deleteOfferFromFavorites(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  /**
   * Проверяет существование предложения по его идентификатору.
   * @param offerId Идентификатор предложения.
   * @returns Промис с булевым значением, указывающим, существует ли предложение.
   */
  exists(offerId: string): Promise<boolean>;
}
