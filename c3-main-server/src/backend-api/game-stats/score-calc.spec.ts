import { scoreCalc, ScoreCalc } from "./score-calc";

function days(days: number) {
  return days * 86400_000;
}
const ca = scoreCalc.config.inactivityMultiplier;
const ct = Date.now();

for (let i = 0; i < 100; i+= 10) {
  console.log(i, scoreCalc.calcNewPlayerPenaltyMultiplier(i));
}

describe(ScoreCalc, () => {
  it('inactivity = minMult for a player who only played a game long time ago', () => {
    expect(
      scoreCalc.calcInactivityPenaltyMultiplier(
        [
          ct - days(ca.daysCap),
        ], ct))
      .toBeCloseTo(ca.minMult);
  });

  it('inactivity = minMult for a player who played a lot but a long time ago', () => {
    expect(
      scoreCalc.calcInactivityPenaltyMultiplier(
        [
          ct - days(ca.daysCap),
          ct - days(ca.daysCap),
          ct - days(ca.daysCap),
          ct - days(ca.daysCap),
          ct - days(ca.daysCap),
          ct - days(ca.daysCap),
          ct - days(ca.daysCap),
          ct - days(ca.daysCap),
          ct - days(ca.daysCap),
          ct - days(ca.daysCap),
        ], ct))
      .toBeCloseTo(ca.minMult);
  });

  it('inactivity = halfway from minMult to 1 for player who came back and just played half the cap games', () => {
    expect(
      scoreCalc.calcInactivityPenaltyMultiplier(
        [
          ct - days(ca.daysCap),
          ct - days(ca.daysCap),
          ct - days(ca.daysCap),
          ct - days(ca.daysCap),
          ct - days(ca.daysCap),
          ct - days(ca.daysTolerated),
          ct - days(ca.daysTolerated),
          ct - days(ca.daysTolerated),
          ct - days(ca.daysTolerated),
          ct - days(ca.daysTolerated),
        ], ct))
      .toBeCloseTo((ca.minMult + 1) / 2);
  });

  it('inactivity = 1 for active players', () => {
    expect(
      scoreCalc.calcInactivityPenaltyMultiplier(
        [
          ct - days(ca.daysTolerated),
          ct - days(ca.daysTolerated),
          ct - days(ca.daysTolerated),
          ct - days(ca.daysTolerated),
          ct - days(ca.daysTolerated),
          ct - days(ca.daysTolerated),
          ct - days(ca.daysTolerated),
          ct - days(ca.daysTolerated),
          ct - days(ca.daysTolerated),
          ct - days(ca.daysTolerated),
        ], ct))
      .toBeCloseTo(1);
  });

  it('inactivity = 1/10 from minMult for a player who just played 1 game', () => {
    expect(
      scoreCalc.calcInactivityPenaltyMultiplier(
        [
          ct - days(ca.daysTolerated),
        ], ct))
      .toBeCloseTo((ca.minMult * 9 + 1) / 10);
  });

  it('inactivity = 0.06681818181818178 for playing only once everyday', () => {
    expect(
      scoreCalc.calcInactivityPenaltyMultiplier(
        [
          ct - days(0),
          ct - days(1),
          ct - days(2),
          ct - days(3),
          ct - days(4),
          ct - days(5),
          ct - days(6),
          ct - days(7),
          ct - days(8),
          ct - days(9),
        ], ct))
      .toBeCloseTo(0.9331818181818182);
  });
});
