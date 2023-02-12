import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from '../entities/SubCategory';
import { Post } from 'src/entities/Post';
import { PostLike } from 'src/entities/PostLike';
import { Comment } from 'src/entities/Comment';
import {
  CreateCommentDto,
  CreateCommentLikesDto,
  DeleteCommentDto,
  UpdateCommentDto,
} from './dto/comment.dto';
import { CommentLike } from 'src/entities/CommentLike';

@Injectable()
export class CommunityRepository {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private commentLikeRepository: Repository<CommentLike>,
  ) {}

  async getAllCategories() {
    const categories = await this.subCategoryRepository.find();
    return categories;
  }

  async createPost(
    title: string,
    userId: number,
    subCategoryId: number,
    contentUrl: string,
  ) {
    const result = await this.postRepository
      .createQueryBuilder()
      .insert()
      .into(Post)
      .values({
        title: title,
        contentUrl: contentUrl,
        userId: userId,
        subCategoryId: subCategoryId,
      })
      .execute();
    return result;
  }

  async getPostList(subCategoryId: number) {
    const result = await this.postRepository
      .createQueryBuilder()
      .select([
        'post.id as postId',
        'post.title',
        'post.view',
        'DATE_FORMAT(post.created_at, "%Y-%m-%d") AS createdAt',
        'user.id as userId',
        'ranker_profile.name AS userName',
        'COUNT(post_like.id) AS postLike',
        'COUNT(comment.id) AS comment',
        'tier.name AS tierName',
        'tier.id AS tierId',
        'sub_category.name AS subCategoryName',
      ])
      .from(Post, 'post')
      .leftJoin('post.user', 'user')
      .leftJoin('post.postLikes', 'post_like')
      .leftJoin('post.comments', 'comment')
      .leftJoin('user.rankerProfiles', 'ranker_profile')
      .leftJoin('ranker_profile.rankings', 'ranking')
      .leftJoin('ranking.tier', 'tier')
      .leftJoin('post.subCategory', 'sub_category')
      .where('post.subCategoryId = :subCategoryId', {
        subCategoryId: subCategoryId,
      })
      .groupBy('post.id')
      .addGroupBy('ranker_profile.name')
      .addGroupBy('tier.name')
      .addGroupBy('tier.id')
      .addGroupBy('ranker_profile.name')
      .addGroupBy('tier.name')
      .getRawMany();
    return result;
  }

  async getIdsOfPostsCreatedByUser(userId: number): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder()
      .select(['id'])
      .where('user_id = :userId', { userId: userId })
      .getRawMany();
  }

  async createOrDeletePostLike(postId, userId) {
    const ifLiked = await this.postLikeRepository.findOne({
      where: { postId: postId, userId: userId },
    });
    if (!ifLiked) {
      try {
        const postLike = new PostLike();
        postLike.postId = postId;
        postLike.userId = userId;
        return await this.postLikeRepository.save(postLike);
      } catch (err) {
        throw new HttpException(
          'Error: invaild postId',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (ifLiked) {
      return await this.postLikeRepository.delete({ id: ifLiked.id });
    }
  }

  async getIdsOfLikesAboutPostCreatedByUser(userId: number): Promise<Post[]> {
    return this.postLikeRepository
      .createQueryBuilder()
      .select(['post_id'])
      .where('user_id = :userId', { userId: userId })
      .getRawMany();
  }

  async createComment(commentData: CreateCommentDto) {
    const data = await this.commentRepository.create(commentData);
    await this.commentRepository.save(data);
  }

  async deleteComment(creteria: DeleteCommentDto) {
    await this.commentRepository.delete(creteria);
  }

  async updateComment(creteria: UpdateCommentDto, toUpdateContent: string) {
    await this.commentRepository.update(creteria, { content: toUpdateContent });
  }

  async readComments(postId: number) {
    return await this.commentRepository.find({
      where: { postId: postId },
      order: { groupOrder: 'asc', createdAt: 'asc' },
    });
  }

  async createCommentLikes(creteria: CreateCommentLikesDto) {
    const isExist = await this.commentLikeRepository.exist({
      where: { userId: creteria.userId, commentId: creteria.commentId },
    });

    if (!isExist) await this.commentLikeRepository.save(creteria);

    await this.commentLikeRepository.delete(creteria);
  }

  async getIdsOfCommentCreatedByUser(userId: number): Promise<Comment[]> {
    return this.commentRepository
      .createQueryBuilder()
      .select(['id'])
      .where('user_id = :userId', { userId: userId })
      .getRawMany();
  }

  async getIsOfLikesAboutCommentsCreatedByUser(
    userId: number,
  ): Promise<CommentLike[]> {
    return this.commentLikeRepository
      .createQueryBuilder()
      .select(['comment_id'])
      .where('user_id = :userId', { userId: userId })
      .getRawMany();
  }
}
