import { Controller, Get, Param } from '@nestjs/common';
import { TopEpisodesService } from '../services/top-episodes/top-episodes.service';
import { ResponseDto } from '../dtos/response.dto';

@Controller('topEpisodes')
export class TvdbController {

  constructor(private service: TopEpisodesService) {
  }

  @Get(':id')
  getTopEpisodes(@Param('id') tvId: number): Promise<ResponseDto> {
    return this.service.getTopEpisodes(tvId);
  }
}
