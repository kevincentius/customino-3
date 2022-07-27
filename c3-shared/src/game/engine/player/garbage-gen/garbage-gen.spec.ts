
import { playerRule, PlayerRule } from '@shared/game/engine/model/rule/player-rule/player-rule';
import { GarbageGen } from '@shared/game/engine/player/garbage-gen/garbage-gen';
import { Attack } from '@shared/game/network/model/attack/attack';
import { AttackType } from '@shared/game/network/model/attack/attack-type';
import 'jest';

describe('Environment', () => {
  it('should get the current environment', async () => {
    const rule: PlayerRule = { ...playerRule };
    rule.garbageBlockingFactor = 0.35;
    rule.garbagePierceFactor = 0.25;

    let mockPlayer: any = {};
    const garbageGen = new GarbageGen(mockPlayer, rule);

    /*
     * Test case: 3+3+3 lines pending, sending 7.
     * Expected: all 7 are used to block
     *    - block factor 0.35
     *      > only 2 line gets blocked, 1+3+3 remains
     *      > 1.28571429 block carry over
     *    - pierce factor 0.25
     *      > 1 line gets sent
     *      > 0.75 attack carry over
     */
    garbageGen.queueAttack(createTestAttacks([3, 3, 3]));
    const send = garbageGen.applyBlock(createTestAttacks([5, 2]));

    // remaining attacks in queue
    expect(garbageGen.attackQueue.length).toBe(3);
    expect(garbageGen.attackQueue[0]?.powerLeft).toBe(1);
    expect(garbageGen.attackQueue[1]?.powerLeft).toBe(3);
    expect(garbageGen.attackQueue[2]?.powerLeft).toBe(3);

    // block carry over
    expect(garbageGen.blockCarryOver).toBeCloseTo(1.28571429);

    // send 1 line
    expect(send.length).toBe(1);
    expect(send[0].power).toBe(1);

    // send carry over
    expect(garbageGen.pierceCarryOver).toBe(0.75);
    
    /*
     * Test case:
     *    - 1+3+3 lines pending
     *    - 1.28571429 block carry over
     *    - 0.75 pierce carry over
     *    - sending 9
     * Expected: all 9 are used to block
     *    - block factor 0.35 --> 3.6 (including carry)
     *      > only 3 lines get blocked, 1+3 remains
     *      > 1.71428571429 block carry over
     *    - piece factor 0.25
     *      > 3 line gets sent
     *      > 0 attack carry over
     */
    const send2 = garbageGen.applyBlock(createTestAttacks([6, 1, 2]));

    // remaining attacks in queue
    expect(garbageGen.attackQueue.length).toBe(2);
    expect(garbageGen.attackQueue[0]?.powerLeft).toBe(1);
    expect(garbageGen.attackQueue[1]?.powerLeft).toBe(3);

    // block carry over
    expect(garbageGen.blockCarryOver).toBeCloseTo(1.71428571429);

    // send 1 line
    expect(send2.length).toBe(2);
    expect(send2[0].power).toBe(2);
    expect(send2[1].power).toBe(1);

    // send carry over
    expect(garbageGen.pierceCarryOver).toBeCloseTo(0);

    /*
     * Test case:
     *    - 1+3 lines pending
     *    - 1.71428571429 block carry over
     *    - 0 attack carry over
     *    - sending 14
     * Expected: partially used to block
     *    - block factor 0.35 --> 11.4285714286 required to block all 4 lines
     *      > all 4 lines get blocked, empty attack queue
     *      > 12 power used for blocking
     *      > 0.571428571 block carry over
     *      > 3.71428571429 power remaining
     *    - piece factor 0.25
     *      > 12 x 0.25 = 3 lines from pierce
     *      >   + 3.71428571429 from power remaining
     *      >   = 6.71428571429 effPower
     *      > 6 lines sent
     *      > 0.71428571429 attack carry over
     */
    const send3 = garbageGen.applyBlock(createTestAttacks([14]));

    // remaining attacks in queue
    expect(garbageGen.attackQueue.length).toBe(0);

    // block carry over
    expect(garbageGen.blockCarryOver).toBeCloseTo(0.571428571);

    // send lines
    expect(send3.length).toBe(1);
    expect(send3[0].power).toBe(6);

    // send carry over
    expect(garbageGen.pierceCarryOver).toBeCloseTo(0.71428571429);
  });
});

function createTestAttacks(powers: number[]): Attack[] {
  return powers.map(power => ({
    power,
    type: AttackType.DIRTY_1,
  }));
}
