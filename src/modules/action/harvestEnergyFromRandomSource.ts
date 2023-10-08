import { findSources } from '../find/findSources';
import { getRandomInt } from '../getRandomInt';
import { actionMove } from './action.move';
import { CreepMemory } from '../../main';

export const harvestEnergyFromRandomSource = (creep: Creep) => {
  if ((creep.memory as CreepMemory).harvestId === undefined) {
    const sources = findSources(creep);
    const target = sources[getRandomInt(sources.length)];
    (creep.memory as CreepMemory).harvestId = target.id;
  }

  const target = Game.getObjectById(
    (creep.memory as CreepMemory).harvestId
  ) as Source;
  if (target) {
    if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
      actionMove(creep, target);
    }
  }
};
