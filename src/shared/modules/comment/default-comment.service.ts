import {CommentService} from './comment-service.interface.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/component.enum.js';
import {types} from '@typegoose/typegoose';
import {CommentEntity} from './comment.entity.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto) {
    const comment = await this.commentModel.create(dto);

    return comment.populate('userId');
  }

  public async findByOfferId(offerId: string) {
    return this.commentModel
      .find({ offerId })
      .populate('userId');
  }

  public async deleteByOfferId(offerId: string) {
    const result = await this.commentModel
      .deleteMany({ offerId })
      .exec();

    return result.deletedCount;
  }
}
