import { saathratriConstants } from '../saathratri-constants.js';

export const serverSaathratriUtils = {

    /**************************************
     * cassandra-server Helper Functions
     **************************************/

    // getCompositePrimaryKeyInstanceVariableInitializationsFromDTOTest(primaryKey) {
    //   return primaryKey.ids.map(pk => `${pk.fieldType} === 'Integer' ? 1 : ${this.getPrimaryKeyValue(pk.fieldType)}`).join(', \n');
    // },
    getCompositePrimaryKeyInstanceVariableInitializationsFromDTOTest(primaryKey) {
        return primaryKey.ids.map(pk => {
  
          let initializationValue = null;
  
          if (  pk.fieldType === 'Boolean' ) {
            initializationValue = 'false';
          } 
          else if (pk.fieldType  === 'Integer') {
            initializationValue = 'intCount.incrementAndGet()';
          }
          else if (pk.fieldType  === 'Long') {
            initializationValue = 'longCount.incrementAndGet()';
          } 
          else {
            initializationValue = this.getPrimaryKeyValue(pk.fieldType);
          }
  
          return `${initializationValue}`;
        }).join(', \n');
      },
}