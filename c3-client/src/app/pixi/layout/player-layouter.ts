/**
 * This class only computes the final position (no animation) of player fields.
 * Slide and death animations are to be implemented somewhere else!
 */
export interface PlayerPos {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LayoutInput {
  width: number;
  height: number;

  playerAspectRatio: number;
  teams: number[];
  main: number;
}

export class GameLayouter {
  localPortion = 0.5;

  getTargetPoses(inp: LayoutInput): PlayerPos[] {
    if (inp.teams.length == 0) return [];

    let ret: PlayerPos[] = [];
    if (inp.teams.length == 1) {
      // solo: center
      ret.push(this.centerPos(0, 0, inp.width, inp.height, inp.playerAspectRatio));
    } else if (inp.teams.length == 2) {
      // 1v1: left half
      ret.push(this.centerPos(0, 0, inp.width / 2, inp.height, inp.playerAspectRatio));
      ret.push(this.centerPos(inp.width / 2, 0, inp.width / 2, inp.height, inp.playerAspectRatio));
      if (inp.main == 1) {
        let swap = ret[0];
        ret[0] = ret[1];
        ret[1] = swap;
      }
    } else {
      // ffa: left localPortion
      ret = ret.concat(this.layoutSidePlayers(inp.teams, inp.main, inp.width * this.localPortion, 0, inp.width * (1 - this.localPortion), inp.height, inp.playerAspectRatio));
      ret[inp.main] = (this.centerPos(0, 0, inp.width * this.localPortion, inp.height, inp.playerAspectRatio));
    }

    return ret;
  }

  private layoutSidePlayers(teams: number[], main: number, x: number, y: number, width: number, height: number, aspectRatio: number): PlayerPos[] {
    let mainTeam = teams[main];
    let r = aspectRatio;

    let { teamSize: teamMap, maxTeamSize } = this.countPlayersPerTeam(teams, main);

    // decide size of other players' view
    let bestWidth: number = null!;
    let bestCols: number = null!;
    let bestRows: number = null!;
    for (let nrCols = maxTeamSize; nrCols >= 1; nrCols--) {
      let nrRows = 0;
      teamMap.forEach((playerIds, team) => nrRows += Math.ceil(playerIds.length / nrCols));
      let maxWidth = width / nrCols;
      let maxHeight = height / nrRows;
      let currentWidth = Math.min(maxWidth, maxHeight * r);

      if (bestWidth == null || currentWidth > bestWidth) {
        bestWidth = currentWidth;
        bestCols = nrCols;
        bestRows = nrRows;
      } else {
        // reducing the nr of cols will make it worse now
        break;
      }
    }

    // update player view positions
    let row = 0;
    let teamKeys = Array.from(teamMap.keys()).sort((a: number, b: number) => {
      let mainTeamDiff = (mainTeam == a ? 0 : 1) - (mainTeam == b ? 0 : 1);
      if (mainTeamDiff != 0) {
        return mainTeamDiff;
      } else {
        let dependentDiff = (a == 0 ? 1 : 0) - (b == 0 ? 1 : 0);
        if (dependentDiff != 0) {
          return dependentDiff;
        } else {
          return a - b;
        }
      }
    });

    let ret: PlayerPos[] = new Array(teams.length);
    for (let team of teamKeys) {
      let col = 0;
      for (let pid of teamMap.get(team)!) {
        ret[pid] = {
          x: x + col * bestWidth,
          y: y + (height - bestWidth / r * bestRows) / 2 + row * bestWidth / r,
          w: bestWidth,
          h: bestWidth / r,
        };
        col++;
        if (col >= bestCols) {
          col = 0;
          row++;
        }
      }
      if (teamMap.get(team)!.length % bestCols != 0) row++;
    }
    return ret;
  }

  private countPlayersPerTeam(teams: number[], main: number) {
    let maxTeamSize = 0;
    let teamSize = new Map<number, number[]>();
    teams.forEach((team, index) => {
      if (main == index) {
        // skip main player
        return;
      };

      let arr = teamSize.get(team);
      if (arr == null) {
        arr = [];
        teamSize.set(team, arr);
      }

      arr.push(index);
      maxTeamSize = Math.max(maxTeamSize, arr.length);
    });
    return { teamSize, maxTeamSize };
  }

  private centerPos(x: number, y: number, w: number, h: number, aspectRatio: number): PlayerPos {
    let width = Math.min(w, h * aspectRatio);
    let height = width / aspectRatio;

    return {
      x: x + (w - width) / 2,
      y: y + (h - height) / 2,
      w: width,
      h: height,
    };
  }
}
