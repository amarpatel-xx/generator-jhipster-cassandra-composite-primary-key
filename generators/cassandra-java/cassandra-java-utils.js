export const javaSaathratriUtils = {
    
    /*****************************************
     * cassandra-java-utils Helper Functions
     *****************************************/

    getCompositePrimaryKeyComputeValue(entityClass, primaryKey) {
      if (primaryKey.composite) {
          return `new ${entityClass}Id(${primaryKey.ids.map(pk => this.getCompositePrimaryKeyValue(pk.fieldType)).join(', ')})`;
      } else {
          return 'UUID.randomUUID()';
      }
    },
      
    getCompositePrimaryKeyValue(primaryKeyType) {
      switch(primaryKeyType) {
        case 'String':
          return 'UUID.randomUUID().toString()';

        case 'UUID':
          return 'UUID.randomUUID()';

        case 'Instant':
          return 'Instant.now()';

        case 'Boolean':
          return 'Boolean.TRUE';
      
        case 'Long':
          return 'new java.util.Random().nextLong()';

        case 'Integer':
          return 'new java.util.Random().nextInt()';
        
        case 'Double':
          return 'new java.util.Random().nextDouble()';

        case 'Float':
          return 'new java.util.Random().nextFloat()';
      }
    },  
    
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