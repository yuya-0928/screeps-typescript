import { findContainers } from '../find/findContainers';
import { findCreepsByRole } from '../find/findCreepsByRole';
import { actionMove } from './action.move';
import { actionTransport } from './actionTransport';

export const actionRefuel = (creep: Creep) => {
  // TODO: Mapにコンテナが存在しなかったら、SpawnerやExtensionに運ぶ

  const extensions = creep.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_CONTAINER;
    },
  });

  console.log(extensions);
  switch (
    extensions.length === 0 ||
    findCreepsByRole('transporter').length === 0
  ) {
    case true:
      actionTransport(creep);
      break;
    case false:
      const closestTarget = creep.pos.findClosestByPath(extensions);
      if (closestTarget) {
        // TODO: Creepの動作状態をMemoryに保存
        if (
          creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
          actionMove(creep, closestTarget);
        }
      }
      break;
  }
};
