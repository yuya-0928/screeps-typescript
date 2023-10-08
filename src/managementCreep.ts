import { creepCosts } from './creepCosts';
import { findContainers } from './modules/find/findContainers';

export const managementCreepCount = {
  // TODO: 同時採掘可能なharvesterの数を割り当てるようにする
  harvester: 4,
  transporter: findContainers.length > 0 ? 3 : 0,
  upgrader: 3,
  builder: 3,
  repaierer: 3,
};

export const minimumHarvesterCount = 2;

export const creepStatus = {
  // const : 250 [WORK, CARRY, MOVE, MOVE]
  // const: 500 [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
  // TODO: harvesterの数が0 && transporterの数が0 && エネルギーの数が300以下だったら、[WORK, CARRY, MOVE, MOVE]に切り替える処理を書く
  harvester: [WORK, CARRY, MOVE, MOVE],
  transporters: [WORK, CARRY, MOVE, MOVE],
  upgrader: [WORK, CARRY, MOVE, MOVE],
  builder: [WORK, CARRY, MOVE, MOVE],
  repaierer: [WORK, CARRY, MOVE, MOVE],
};

export const caluclateCreepCost = (creepStatus: BodyPartConstant[]): number => {
  let cost = 0;
  for (const bodyPart of creepStatus) {
    cost += creepCosts[bodyPart];
  }
  return cost;
};
