
export interface TeamStyle {
  roomIconColor: number;
  roomTextColor: number;
  boardBorderColor: number;
}

export const soloStyle: TeamStyle = {
  roomIconColor: 0x777777,
  roomTextColor: 0xeeeeee,
  boardBorderColor: 0xaaaaaa,
}

export const teamStyles: TeamStyle[] = [
  {
    roomIconColor: 0xbb8888,
    roomTextColor: 0xffdddd,
    boardBorderColor: 0xff8888,
  },
  {
    roomIconColor: 0x999933,
    roomTextColor: 0xffffbb,
    boardBorderColor: 0xcccc88,
  },
  {
    roomIconColor: 0x88bb88,
    roomTextColor: 0xddffdd,
    boardBorderColor: 0x88ff88,
  },
  {
    roomIconColor: 0x8888ff,
    roomTextColor: 0xddddff,
    boardBorderColor: 0x8888ff,
  },
];
