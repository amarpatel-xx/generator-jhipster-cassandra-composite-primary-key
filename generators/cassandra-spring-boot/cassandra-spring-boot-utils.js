export const springBootSaathratriUtils = {

    /*******************************************
     * spring-boot-saathtratri Helper Functions
     *******************************************/
    getFieldPrimitiveType(field) {
        switch (field.fieldType) {
            case 'String':
                return '.toString()';
            case 'Integer':
                return '.intValue()';
            case 'Long':
                return '.intValue()';
            case 'Float':
                return '.intValue()';
            case 'Double':
                return '.intValue()';
            case 'UUID':
                return '.toString()';
            default:
                return '.toString()';
        }
    },

    setSaathratriNonPrimaryKeyBooleanSampleValues(entity) {
        entity.fields.forEach(field => {
            if (field.fieldType === 'Boolean') {
                field.javaValueSample1 = 'false';
                field.javaValueSample2 = 'true';
            } else if(field.fieldTypeSetSaathratri) {
                field.javaValueSample1 = `new java.util.TreeSet<${field.fieldType}>() {{ add("${field.fieldName}1"); }}`;
                field.javaValueSample2 = `new java.util.TreeSet<${field.fieldType}>() {{ add("${field.fieldName}2"); }}`;
            } else if(field.fieldType === 'LocalDate') {
                field.javaValueSample1 = 'java.time.LocalDate.now()';
                field.javaValueSample2 = 'java.time.LocalDate.now()';
            }

            if(!field.isCompositePrimaryKeyField) {
                field.includeField = true;
            }
        });
    }

    
 }