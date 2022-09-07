import { Injectable, OnModuleInit } from "@nestjs/common";
import { RoomService } from "./room-service";

@Injectable()
export class ServerRoomService implements OnModuleInit {
  constructor(
    private roomService: RoomService,
  ) {}

  onModuleInit() {
    const ffaRoom = this.roomService.createServerRoom('Standard play', {
      gameRule: JSON.parse(`{"roomRule":{"width":10,"height":18,"invisibleHeight":18,"previews":1,"rotationSystem":"nearest","gravity":{"speed":1,"cap":10,"acceleration":0,"lockDelay":1},"countdownMs":3250,"lagTolerance":5000,"garbageSpawnDelayTable":[0,1],"garbageSpawnRate":1,"garbageBlockingFactor":1,"garbagePierceFactor":0,"attackSelfIfAlone":false,"useComboTimer":true,"comboAttackTable":[0,0,1,1,2,2,3,3,4,5,6,7,8,9,10,11,12,13],"comboTimerInitial":2,"comboTimerMultiClearBonus":[-0.2,1,1.4,1.7,2],"comboTimerSpinBonus":[0,1.5,2,2.5],"comboTimerTimeBonusMultiplierTable":[1,0.7,0.5,0.3,0.2,0.1],"multiClearAttackTable":[0,0,1,2,4,6],"stars":{"useStars":true,"multipliers":[1,1.05,1.1,1.15,1.2,1.25,1.3],"multiplierScalesByProgress":true,"powerRequired":[25,35,50,70,100,200],"powerDecayPerPiece":true,"powerDecayPerPieceRate":[0.1,0.15,0.2,0.25,0.3,0.3],"powerDecay":true,"powerDecayRate":[20,30,40,50,60,90],"powerDecayScalesByProgress":true},"sonicDropEffect":{"duration":200,"decay":2,"particleCount":2,"particleOpacity":0.3,"particleScale":0.2,"particleDuration":1500,"particleSpeed":250,"particleMaxAngle":10,"particleSaturation":1,"particleBrightness":1,"comboCap":12,"comboBrightnessMultiplier":4,"comboDurationMultiplier":2,"comboParticleCountMultiplier":4},"lineClearEffect":{"fallAcceleration":1.5,"fallDelay":0,"fallSpreadDelay":0,"flashDuration":150,"flashOpacity":0.5},"playerDisplayDupes":1}}`),
    });

    const digRoom = this.roomService.createServerRoom('Test room', {
      gameRule: JSON.parse(`{"roomRule":{"width":10,"height":18,"invisibleHeight":18,"previews":1,"rotationSystem":"nearest","gravity":{"speed":1,"cap":10,"acceleration":0,"lockDelay":1},"countdownMs":3250,"lagTolerance":5000,"garbageSpawnDelayTable":[0,1],"garbageSpawnRate":1,"garbageBlockingFactor":1,"garbagePierceFactor":0,"attackSelfIfAlone":false,"useComboTimer":true,"comboAttackTable":[0,0,1,1,2,2,3,3,4,5,6,7,8,9,10,11,12,13],"comboTimerInitial":2,"comboTimerMultiClearBonus":[-0.2,1,1.4,1.7,2],"comboTimerSpinBonus":[0,1.5,2,2.5],"comboTimerTimeBonusMultiplierTable":[1,0.7,0.5,0.3,0.2,0.1],"multiClearAttackTable":[0,0,1,2,4,6],"stars":{"useStars":true,"multipliers":[1,1.05,1.1,1.15,1.2,1.25,1.3],"multiplierScalesByProgress":true,"powerRequired":[25,35,50,70,100,200],"powerDecayPerPiece":true,"powerDecayPerPieceRate":[0.1,0.15,0.2,0.25,0.3,0.3],"powerDecay":true,"powerDecayRate":[20,30,40,50,60,90],"powerDecayScalesByProgress":true},"sonicDropEffect":{"duration":200,"decay":2,"particleCount":2,"particleOpacity":0.3,"particleScale":0.2,"particleDuration":1500,"particleSpeed":250,"particleMaxAngle":10,"particleSaturation":1,"particleBrightness":1,"comboCap":12,"comboBrightnessMultiplier":4,"comboDurationMultiplier":2,"comboParticleCountMultiplier":4},"lineClearEffect":{"fallAcceleration":1.5,"fallDelay":0,"fallSpreadDelay":0,"flashDuration":150,"flashOpacity":0.5},"playerDisplayDupes":1}}`),
    });
  }
}
