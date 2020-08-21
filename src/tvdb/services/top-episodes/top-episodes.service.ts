import { Injectable } from '@nestjs/common';
import { EpisodesListDto } from '../dtos/episodes-list.dto';

@Injectable()
export class TopEpisodesService {

  private sortDataByKey() {

  }

  getTopEpisodes(): Promise<EpisodesListDto> {

  }
}
