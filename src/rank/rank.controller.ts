import { Controller, Get, Param } from '@nestjs/common';
import { RankService } from './rank.service';

@Controller('ranks')
export class RankController {
  constructor(private rankService: RankService) {}

  @Get('/:userName')
  async getRankerDetail(@Param('userName') userName: string) {
    return await this.rankService.getRankerDetail(userName);
  }

  @Get('/ranking/top5')
  async getTop5() {
    return await this.rankService.getTop5();
  }

  @Get('/ranking/top100')
  async getTop100() {
    return await this.rankService.getTop100();
  }
}
