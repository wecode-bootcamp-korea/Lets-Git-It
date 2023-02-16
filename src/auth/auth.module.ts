import { CommunityRepository } from './../community/community.repository';
import { MainCategory } from 'src/entities/MainCategory';
import { SubCategory } from 'src/entities/SubCategory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/User';
import { Field } from '../entities/Field';
import { Career } from '../entities/Career';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthRepository } from './auth.repository';
import { RankModule } from 'src/rank/rank.module';
import { Post } from 'src/entities/Post';
import { PostLike } from 'src/entities/PostLike';
import { CommentLike } from 'src/entities/CommentLike';
import { RankerProfile } from 'src/entities/RankerProfile';
import { Ranking } from 'src/entities/Ranking';
import { Tier } from 'src/entities/Tier';
import { Comment } from 'src/entities/Comment';
import { CommunityService } from 'src/community/community.service';
import { RankService } from 'src/rank/rank.service';
import { RankingRepository } from 'src/rank/ranking.repository';
import { TierRepository } from 'src/rank/tier.repository';
import { UserRepository } from 'src/user/user.repository';
import { RankerProfileRepository } from 'src/rank/rankerProfile.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Field,
      Career,
      SubCategory,
      MainCategory,
      Post,
      PostLike,
      Comment,
      CommentLike,
      RankerProfile,
      Ranking,
      Tier,
    ]),
    HttpModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    RankModule,
    RankerProfile,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    AuthRepository,
    CommunityRepository,
    CommunityService,
    RankService,
    RankingRepository,
    TierRepository,
    UserRepository,
    RankerProfileRepository,
  ],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}