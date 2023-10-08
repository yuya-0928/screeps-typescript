import { caluclateCreepCost, managementCreepCount } from '../managementCreep';
import { creepStatus } from '../managementCreep';
import { findSourceBuildingCreep } from './find/findSourceBuildingCreep';

export const logger = {
  creepCountInfo: (
    harvesters: Creep[],
    transporters: Creep[],
    upgraders: Creep[],
    builders: Creep[],
    repaierers: Creep[]
  ) => {
    console.log(
      'harvesters: ' +
        harvesters.length +
        ' / ' +
        managementCreepCount.harvester,
      'transporters: ' +
        transporters.length +
        ' / ' +
        managementCreepCount.transporter,
      'upgraders: ' + upgraders.length + ' / ' + managementCreepCount.upgrader,
      'builders: ' + builders.length + ' / ' + managementCreepCount.builder,
      'repaierers: ' +
        repaierers.length +
        ' / ' +
        managementCreepCount.repaierer
    );
  },

  creepCosts: () => {
    console.log(
      'harvesters_cost: ' + caluclateCreepCost(creepStatus.harvester),
      'transporters_cost: ' + caluclateCreepCost(creepStatus.transporters),
      'upgraders_cost: ' + caluclateCreepCost(creepStatus.upgrader),
      'builders_cost: ' + caluclateCreepCost(creepStatus.builder),
      'repaierers_cost: ' + caluclateCreepCost(creepStatus.repaierer)
    );
  },

  sourceCountBuildingCreep: () => {
    console.log('sourceCountBuildingCreep: ' + findSourceBuildingCreep());
  },
};
