export interface Channel {
  id          : string;
  nameJa      : string;
  nameEn      : string;
  color       : string;
  mark        : string;
  description : string;
  thumbnailUrl: string;
  bannerUrl   : string;
  twitterUrl  : string;
  youtubeUrl  : string;
  bilibiliUrl : string;
}

export interface Schedule {
  start_at: any;
  channels: object[];
}
