import { memoryManager } from '../memoryManager';
import { CreepMemory } from '../../main';
import { isCreepStoreEmpty, isCreepStoreFull } from '../check/check.store';
import { actionMove } from '../action/action.move';
import { withdrowEnegy } from '../action/withdrowEnegy';
import { findContainers } from '../find/findContainers';
import { harvestEnergyFromRandomSource } from '../action/harvestEnergyFromRandomSource';

const isUpgrading = (creep: Creep) => {
  return (creep.memory as CreepMemory).upgrading;
};

export const roleUpgrader = {
  run: function (creep: Creep) {
    (creep.memory as CreepMemory).roleAs = 'upgrader';
    // TODO: Creepが作りたての状態を考慮できていないため、roleのみが設定された状態のCreepの扱いを決める
    switch (isUpgrading(creep)) {
      // TODO: true, falseから具体的な状態名にする
      case true:
        if (isCreepStoreEmpty(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).upgrading = false;
          creep.say('🔄 harvest');
        }

        if (creep.room.controller) {
          if (
            creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE
          ) {
            // TODO: Creepの動作状態をMemoryに保存
            actionMove(creep, creep.room.controller);
            break;
          }

          creep.upgradeController(creep.room.controller);
          break;
        }
        break;

      case false:
        if (isCreepStoreFull(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).upgrading = true;
          creep.say('⚡ upgrade');
        }

        // コンテナからエナジーを取得する
        if (findContainers(creep).length > 0) {
          withdrowEnegy(creep);
        } else {
          // TODO: コンテナがなかったら、harvesterからエネルギーを受け取るコードに置き換える
          // TODO: harvesterのMemoryに受け渡し待機のフラグを立てる
          harvestEnergyFromRandomSource(creep);
        }
        break;

      case undefined:
        // TODO: Creepが作りたての状態が決まったら削除する
        if (isCreepStoreEmpty(creep)) {
          memoryManager.refreshMemory(creep);
          (creep.memory as CreepMemory).upgrading = false;
          creep.say('🔄 harvest');
        }
        break;
    }
  },
};
