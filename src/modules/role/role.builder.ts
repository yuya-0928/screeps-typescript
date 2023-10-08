import { memoryManager } from '../memoryManager';
import { CreepMemory } from '../../main';
import { isCreepStoreEmpty, isCreepStoreFull } from '../check/check.store';
import { withdrowEnegy } from '../action/withdrowEnegy';
import { findCreepsByRole } from '../find/findCreepsByRole';
import { minimumHarvesterCount } from '../../managementCreep';
import { roleHarvester } from './role.harvester';
import { roleRepaierer } from './role.repaierer';
import { roleUpgrader } from './role.upgrader';
import { actionBuild } from '../action/actionBuild';
import { findContainers } from '../find/findContainers';
import { harvestEnergyFromRandomSource } from '../action/harvestEnergyFromRandomSource';

const isBuilding = (creep: Creep) => {
  return (creep.memory as CreepMemory).buildinga;
};

// TODO: settingRoleはbuilderとしてのタスクの実行に失敗したら実行する
const settingRole = (creep: Creep) => {
  const buildingTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
  const repaierTargets = creep.room.find(FIND_STRUCTURES, {
    filter: (object) => object.hits < object.hitsMax,
  });
  if (buildingTargets.length > 0) {
    (creep.memory as CreepMemory).roleAs = 'builder';
  } else if (repaierTargets.length > 0) {
    (creep.memory as CreepMemory).roleAs = 'repaierer';
    roleRepaierer.run(creep);
    return;
  } else {
    (creep.memory as CreepMemory).roleAs = 'upgrader';
    roleUpgrader.run(creep);
    return;
  }
};

export const roleBuilder = {
  run: (creep: Creep) => {
    settingRole(creep);
    console.log(
      '(creep.memory as CreepMemory).building',
      (creep.memory as CreepMemory).buildinga
    );
    if ((creep.memory as CreepMemory).roleAs !== 'builder') {
      return;
    }

    // TODO: Creepが作りたての状態を考慮できていないため、roleのみが設定された状態のCreepの扱いを決める
    switch (isBuilding(creep)) {
      // TODO: true, falseから具体的な状態名にする
      case 'building':
        console.log('isBuilding(creep) true');
        if (isCreepStoreEmpty(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).buildinga = 'harvesting';
          creep.say('🔄 harvest');
          break;
        }

        actionBuild(creep);
        break;

      case 'harvesting':
        console.log('isBuilding(creep) false');
        if (isCreepStoreFull(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).buildinga = 'building';
          creep.say('🚧 build');
          break;
        }
        if (findContainers(creep).length > 0) {
          withdrowEnegy(creep);
        } else {
          // TODO: harvesterからエネルギーを受け取るコードに置き換える
          // TODO: harvesterのMemoryに受け渡し待機のフラグを立てる
          harvestEnergyFromRandomSource(creep);
        }
        break;

      case undefined:
        // TODO: Creepが作りたての状態が決まったら削除する
        console.log('isBuilding(creep) undefined');
        memoryManager.refreshMemory(creep);
        (creep.memory as CreepMemory).buildinga = 'harvesting';
        creep.say('🔄 harvest');
        break;
    }
  },
};
