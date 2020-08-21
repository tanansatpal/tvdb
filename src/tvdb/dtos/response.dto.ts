export class ResponseEpisode {
  episodeName: string;
  averageVotes: number;
}

export class ResponseDto {
  episodes: ResponseEpisode[];
}
