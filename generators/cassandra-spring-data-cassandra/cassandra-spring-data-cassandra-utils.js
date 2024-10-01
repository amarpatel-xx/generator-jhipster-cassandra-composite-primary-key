import _ from 'lodash';

export const springDataCassandraSaathratriUtils = {
    
    /****************************************************
     * cassandra-spring-data-cassandra Helper Functions
     ****************************************************/

    generatePrimaryKeyMethods(entityClass, primaryKey, fileType, entityInstance) {
        // Initialize an array to hold method signatures
        const methodsCode = [];

        // Check if primaryKey.ids is available and is an array
        if (!primaryKey || !Array.isArray(primaryKey.ids)) {
            console.error('Invalid primary key details provided');
            return [];
        }
    
        let methodNameString = "";
        let methodParametersDeclarationsString = "";
        let methodParametersInstancesString = "";
        let methodJavaDocParametersString = "";
        let methodUrlSubstitutionParameters = "";
        let methodLogSubstitutionParameters = "";
        let methodResourceParametersDeclarationsString = "";

        // Iterate over each primary key ID
        // Initialize an index
        let index = 0;

        // Get the total length of primaryKey.ids
        const totalIds = primaryKey.ids.length;

        // Iterate over each primary key ID with an index
        // We break out of the loop when we reach the second last index, because we do not
        // want to add a find method with all the composite primary key fields.
        for (index = 0; index < totalIds - 1; index++) {
            const { fieldName, fieldType, fieldNameHumanized } = primaryKey.ids[index];

            if(methodNameString != "") {
                methodNameString += "And" + primaryKey.nameCapitalized + _.upperFirst(fieldName);
                methodParametersDeclarationsString += ", ";
                methodParametersInstancesString += ", ";
                methodJavaDocParametersString += "\n";
                methodLogSubstitutionParameters += ", ";
                methodResourceParametersDeclarationsString += ", ";
            } else {
                methodNameString = 'findAllBy' + primaryKey.nameCapitalized + _.upperFirst(fieldName);                
            }

            methodParametersDeclarationsString += `final ${fieldType} ${fieldName}`;
            methodParametersInstancesString += fieldName;
            methodJavaDocParametersString += ` * @param ${fieldName} the ${fieldNameHumanized} of the ${entityInstance} to retrieve.`;
            methodUrlSubstitutionParameters += `/:${fieldName}`;
            methodLogSubstitutionParameters += `${fieldName}: {}`;
            methodResourceParametersDeclarationsString += `@RequestParam(name = "${fieldName}", required = true) final ${fieldType} ${fieldName}`

            if(fileType === 'Service') {
                // Get Declaration
                methodsCode.push(this.getPrimaryKeyMethodSignature(primaryKey, entityClass, methodNameString, '', methodParametersDeclarationsString) + ';\n');
            } else if(fileType === 'Repository') {
                // Get Declaration
                methodsCode.push(this.getPrimaryKeyRepositoryMethodSignature(primaryKey, entityClass, methodNameString, '', methodParametersDeclarationsString) + ';\n');
            } else if(fileType === 'ServiceImpl') {
                // Get Implementation
                methodsCode.push(this.generatePrimaryKeyServiceMethodImplementation(primaryKey, entityClass, methodNameString, '', methodParametersDeclarationsString, methodParametersInstancesString));
            } else if(fileType === 'Resource') {
                // Get Implementation
                methodsCode.push(this.generatePrimaryKeyResourceMethodImplementation(
                    primaryKey,
                    entityClass, 
                    methodNameString, 
                    '',  
                    methodParametersInstancesString, 
                    methodUrlSubstitutionParameters, 
                    methodResourceParametersDeclarationsString,
                    methodLogSubstitutionParameters,
                    methodJavaDocParametersString, 
                    entityInstance));
            }

            if(fieldType === 'Long') {  
                if(fileType === 'Service') {
                    // Get Signature
                    methodsCode.push(this.getPrimaryKeyMethodSignature(primaryKey, entityClass, methodNameString, 'LessThan', methodParametersDeclarationsString) + ';\n');
                    methodsCode.push(this.getPrimaryKeyMethodSignature(primaryKey, entityClass, methodNameString, 'GreaterThan', methodParametersDeclarationsString) + ';\n');
                } else if(fileType === 'Repository') {
                    // Get Signature
                    methodsCode.push(this.getPrimaryKeyRepositoryMethodSignature(primaryKey, entityClass, methodNameString, 'LessThan', methodParametersDeclarationsString) + ';\n');
                    methodsCode.push(this.getPrimaryKeyRepositoryMethodSignature(primaryKey, entityClass, methodNameString, 'GreaterThan', methodParametersDeclarationsString) + ';\n');
                } else if(fileType === 'ServiceImpl') {     
                    // Get Implementation
                    methodsCode.push(this.generatePrimaryKeyServiceMethodImplementation(primaryKey, entityClass, methodNameString, 'LessThan', methodParametersDeclarationsString, methodParametersInstancesString));
                    methodsCode.push(this.generatePrimaryKeyServiceMethodImplementation(primaryKey, entityClass, methodNameString, 'GreaterThan', methodParametersDeclarationsString, methodParametersInstancesString));
                } else if(fileType === 'Resource') {
                    // Get Implementation
                    methodsCode.push(this.generatePrimaryKeyResourceMethodImplementation(
                        primaryKey,
                        entityClass, 
                        methodNameString, 
                        'LessThan', 
                        methodParametersInstancesString, 
                        methodUrlSubstitutionParameters,
                        methodResourceParametersDeclarationsString,
                        methodLogSubstitutionParameters,
                        methodJavaDocParametersString,   
                        entityInstance));
                    methodsCode.push(this.generatePrimaryKeyResourceMethodImplementation(
                        primaryKey,
                        entityClass, 
                        methodNameString, 
                        'GreaterThan', 
                        methodParametersInstancesString, 
                        methodUrlSubstitutionParameters,
                        methodResourceParametersDeclarationsString,
                        methodLogSubstitutionParameters,
                        methodJavaDocParametersString,   
                        entityInstance));
                }
            }
        }

        // Return the array containing all method signatures
        return methodsCode;
    },

    generatePrimaryKeyServiceMethodImplementation(primaryKey, entityClass, methodNameString, operatorString, methodParametersDeclarationsString, methodParametersInstancesString) {
        let methodImplementationString = "@Override \npublic " + this.getPrimaryKeyMethodSignature(primaryKey, entityClass, methodNameString, operatorString, methodParametersDeclarationsString) + `{\n`;
        methodImplementationString += `LOG.debug("Request to ${methodNameString}${operatorString}(${methodParametersDeclarationsString}) service in ${entityClass}ServiceImpl.");\n`;
        methodImplementationString += `return ${_.lowerFirst(entityClass)}Repository.${methodNameString}${operatorString}(${methodParametersInstancesString})\n`;
        methodImplementationString += `.stream()\n`;
        methodImplementationString += `.map(${_.lowerFirst(entityClass)}Mapper::toDto)\n`;
        methodImplementationString += `.collect(Collectors.toCollection(LinkedList::new));\n`;
        methodImplementationString += '}\n';

        return methodImplementationString;
    },

    generatePrimaryKeyResourceMethodImplementation(
        primaryKey,
        entityClass, 
        methodNameString, 
        operatorString,  
        methodParametersInstancesString, 
        methodUrlSubstitutionParameters, 
        methodResourceParametersDeclarationsString,
        methodLogSubstitutionParameters, 
        methodJavaDocParametersString,   
        entityInstance) {

        let methodImplementationString = "/** \n";
        methodImplementationString += ` * // Composite Primary Key Code \n`; 
        methodImplementationString += ` * {@code GET /${this.getCompositePrimaryKeyGetMappingUrl(methodNameString + operatorString)}${methodUrlSubstitutionParameters}}\n`;
        methodImplementationString += ` * \n`;
        methodImplementationString += ` * \n`;
        methodImplementationString += `${methodJavaDocParametersString}`;
        methodImplementationString += ` * \n`;
        methodImplementationString += ` * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ${entityInstance}, or with status {@code 404 (Not Found)}. \n`;
        methodImplementationString += ` */ \n`;
        methodImplementationString += `@GetMapping("/${this.getCompositePrimaryKeyGetMappingUrl(methodNameString + operatorString)}")\n`;
        methodImplementationString += "public " + this.getPrimaryKeyMethodSignature(primaryKey, entityClass, methodNameString, operatorString, methodResourceParametersDeclarationsString) + `{ \n`;
        methodImplementationString += "  // Composite Primary Key Code \n";
        methodImplementationString += `  LOG.debug("REST request to ${methodNameString + operatorString} method for ${entityClass}s with parameteres ${methodLogSubstitutionParameters}", ${methodParametersInstancesString}); \n`;
        methodImplementationString += `  return  ${entityInstance}Service.${methodNameString + operatorString}(${methodParametersInstancesString}); \n`;
        methodImplementationString += '}\n';

        return methodImplementationString;
    },

    getPrimaryKeyMethodSignature(primaryKey, entityClass, methodNameString, operatorString, methodParametersDeclarationsString) {
        return `List<${entityClass}DTO> ${methodNameString}${operatorString}(${methodParametersDeclarationsString})`;
    },

    getPrimaryKeyRepositoryMethodSignature(primaryKey, entityClass, methodNameString, operatorString, methodParametersDeclarationsString) {
        return `List<${entityClass}> ${methodNameString}${operatorString}(${methodParametersDeclarationsString})`;
    },

    getCompositePrimaryKeyGetMappingUrl(methodName) {
        methodName = methodName.charAt(0).toLowerCase() + methodName.slice(1);
        
        return methodName.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
    },

    getCompositePrimaryKeyLogStatement(primaryKey) {
        return primaryKey.ids.map(pk => `${pk.fieldName}: {}`).join(', ');
    },

    getCompositePrimaryKeyResourceClassMethodQueryParameters(primaryKey) {
        return primaryKey.ids.map(pk => `@RequestParam(name = "${pk.fieldName}", required = true) final ${pk.fieldType} ${pk.fieldName}`).join(', \n');
    },
}