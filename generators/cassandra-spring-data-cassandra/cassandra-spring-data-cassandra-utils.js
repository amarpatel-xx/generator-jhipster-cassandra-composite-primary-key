import _ from 'lodash';

export const springDataCassandraSaathratriUtils = {
    
    /****************************************************
     * cassandra-spring-data-cassandra Helper Functions
     ****************************************************/

    generatePrimaryKeyMethods(entityClass, entityInstance, entityInstanceSnakeCase, primaryKey, fileType) {
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
        let methodRepositoryParametersQueryString = "";

        // Iterate over each primary key ID
        // Initialize an index
        let index = 0;

        // Get the total length of primaryKey.ids
        const totalIds = primaryKey.ids.length;

        // Iterate over each primary key ID with an index
        // We break out of the loop when we reach the second last index, because we do not
        // want to add a find method with all the composite primary key fields.
        for (index = 0; index < totalIds - 1; index++) {
            const { fieldName, fieldType, fieldNameHumanized, fieldNameUnderscored } = primaryKey.ids[index];

            if(methodNameString != "") {
                methodNameString += "And" + primaryKey.nameCapitalized + _.upperFirst(fieldName);
                methodParametersDeclarationsString += ", ";
                methodParametersInstancesString += ", ";
                methodJavaDocParametersString += "\n";
                methodLogSubstitutionParameters += ", ";
                methodResourceParametersDeclarationsString += ", ";
                methodRepositoryParametersQueryString += " AND ";
            } else {
                methodNameString = primaryKey.nameCapitalized + _.upperFirst(fieldName);                
            }

            methodParametersDeclarationsString += `final ${fieldType} ${fieldName}`;
            methodParametersInstancesString += fieldName;
            methodJavaDocParametersString += ` * @param ${fieldName} the ${fieldNameHumanized} of the ${entityInstance} to retrieve.`;
            methodUrlSubstitutionParameters += `/:${fieldName}`;
            methodLogSubstitutionParameters += `${fieldName}: {}`;
            methodResourceParametersDeclarationsString += `@RequestParam(name = "${fieldName}", required = true) final ${fieldType} ${fieldName}`;
           
            if(primaryKey.hasTimeUUID) {
                methodRepositoryParametersQueryString += `${fieldNameUnderscored} = ?${index}`;
            }

            if(fileType === 'Service') {
                // Get Declaration
                methodsCode.push(this.getPrimaryKeyMethodSignature(entityClass, 'findAllBy', methodNameString, '', methodParametersDeclarationsString) + ';\n');
            } else if(fileType === 'Repository') {
                // Get Declaration
                methodsCode.push(this.getPrimaryKeyRepositoryMethodSignature(entityClass, entityInstanceSnakeCase, 'findAllBy', methodNameString, '', methodParametersDeclarationsString, '') + ';\n');
            } else if(fileType === 'ServiceImpl') {
                // Get Implementation
                methodsCode.push(this.generatePrimaryKeyServiceMethodImplementation(entityClass, 'findAllBy',  methodNameString, '', methodParametersDeclarationsString, methodParametersInstancesString));
            } else if(fileType === 'Resource') {
                // Get Implementation
                methodsCode.push(this.generatePrimaryKeyResourceMethodImplementation(
                    entityClass, 
                    'findAllBy',
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
                    methodsCode.push(this.getPrimaryKeyMethodSignature(entityClass, 'findAllBy', methodNameString, 'LessThan', methodParametersDeclarationsString) + ';\n');
                    methodsCode.push(this.getPrimaryKeyMethodSignature(entityClass, 'findAllBy', methodNameString, 'GreaterThan', methodParametersDeclarationsString) + ';\n');
                } else if(fileType === 'Repository') {
                    // Get Signature
                    methodsCode.push(this.getPrimaryKeyRepositoryMethodSignature(entityClass, entityInstanceSnakeCase, 'findAllBy', methodNameString, 'LessThan', methodParametersDeclarationsString, '') + ';\n');
                    methodsCode.push(this.getPrimaryKeyRepositoryMethodSignature(entityClass, entityInstanceSnakeCase, 'findAllBy', methodNameString, 'GreaterThan', methodParametersDeclarationsString, '') + ';\n');
                } else if(fileType === 'ServiceImpl') {     
                    // Get Implementation
                    methodsCode.push(this.generatePrimaryKeyServiceMethodImplementation(entityClass, 'findAllBy', methodNameString, 'LessThan', methodParametersDeclarationsString, methodParametersInstancesString));
                    methodsCode.push(this.generatePrimaryKeyServiceMethodImplementation(entityClass, 'findAllBy', methodNameString, 'GreaterThan', methodParametersDeclarationsString, methodParametersInstancesString));
                } else if(fileType === 'Resource') {
                    // Get Implementation
                    methodsCode.push(this.generatePrimaryKeyResourceMethodImplementation(
                        entityClass, 
                        'findAllBy', 
                        methodNameString, 
                        'LessThan', 
                        methodParametersInstancesString, 
                        methodUrlSubstitutionParameters,
                        methodResourceParametersDeclarationsString,
                        methodLogSubstitutionParameters,
                        methodJavaDocParametersString,   
                        entityInstance));
                    methodsCode.push(this.generatePrimaryKeyResourceMethodImplementation(
                        entityClass, 
                        'findAllBy',
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

        if(primaryKey.hasTimeUUID) {
            if(fileType === 'Service') {
                methodsCode.push(this.getPrimaryKeyMethodSignature(entityClass, 'findLatestBy', methodNameString, '', methodParametersDeclarationsString) + ';\n');  
            } else if(fileType === 'Repository') {
                methodsCode.push(this.getPrimaryKeyRepositoryMethodSignature(entityClass, entityInstanceSnakeCase, 'findLatestBy', methodNameString, '', methodParametersDeclarationsString, methodRepositoryParametersQueryString) + ';\n');  
            } else if(fileType === 'ServiceImpl') {
                methodsCode.push(this.generatePrimaryKeyServiceMethodImplementation(entityClass, 'findLatestBy', methodNameString, '', methodParametersDeclarationsString, methodParametersInstancesString) + ';\n');  
            } else if(fileType === 'Resource') {
                // Get Implementation
                methodsCode.push(this.generatePrimaryKeyResourceMethodImplementation(
                    entityClass, 
                    'findLatestBy',
                    methodNameString, 
                    '',  
                    methodParametersInstancesString, 
                    methodUrlSubstitutionParameters, 
                    methodResourceParametersDeclarationsString,
                    methodLogSubstitutionParameters,
                    methodJavaDocParametersString, 
                    entityInstance));
            }             
        }

        // Return the array containing all method signatures
        return methodsCode;
    },

    generatePrimaryKeyServiceMethodImplementation(entityClass, methodNamePrefix, methodNameString, operatorString, methodParametersDeclarationsString, methodParametersInstancesString) {
        let methodImplementationString = "@Override \npublic " + this.getPrimaryKeyMethodSignature(entityClass, methodNamePrefix, methodNameString, operatorString, methodParametersDeclarationsString) + `{\n`;
        methodImplementationString += `LOG.debug("Request to ${methodNamePrefix}${methodNameString}${operatorString}(${methodParametersDeclarationsString}) service in ${entityClass}ServiceImpl.");\n`;
        methodImplementationString += `return ${_.lowerFirst(entityClass)}Repository.${methodNamePrefix}${methodNameString}${operatorString}(${methodParametersInstancesString})\n`;
        
        if(methodNamePrefix === 'findAllBy') {
            methodImplementationString += `.stream()\n`;
        }

        methodImplementationString += `.map(${_.lowerFirst(entityClass)}Mapper::toDto)\n`;
        
        if(methodNamePrefix === 'findLatestBy') {
            methodImplementationString += '.orElse(null); // Return null if no record found\n';
        } else {
            methodImplementationString += '.collect(Collectors.toCollection(LinkedList::new));\n';
        }

        methodImplementationString += '}\n';

        return methodImplementationString;
    },

    generatePrimaryKeyResourceMethodImplementation(
        entityClass,
        methodNamePrefix,
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
        methodImplementationString += ` * {@code GET /${this.getCompositePrimaryKeyGetMappingUrl(methodNamePrefix + methodNameString + operatorString)}${methodUrlSubstitutionParameters}}\n`;
        methodImplementationString += ` * \n`;
        methodImplementationString += ` * \n`;
        methodImplementationString += `${methodJavaDocParametersString}`;
        methodImplementationString += ` * \n`;
        methodImplementationString += ` * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ${entityInstance}, or with status {@code 404 (Not Found)}. \n`;
        methodImplementationString += ` */ \n`;
        methodImplementationString += `@GetMapping("/${this.getCompositePrimaryKeyGetMappingUrl(methodNamePrefix + methodNameString + operatorString)}")\n`;
        methodImplementationString += "public " + this.getPrimaryKeyMethodSignature(entityClass, methodNamePrefix, methodNameString, operatorString, methodResourceParametersDeclarationsString) + `{ \n`;
        methodImplementationString += "  // Composite Primary Key Code \n";
        methodImplementationString += `  LOG.debug("REST request to ${methodNamePrefix + methodNameString + operatorString} method for ${entityClass}s with parameteres ${methodLogSubstitutionParameters}", ${methodParametersInstancesString}); \n`;
        methodImplementationString += `  return  ${entityInstance}Service.${methodNamePrefix + methodNameString + operatorString}(${methodParametersInstancesString}); \n`;
        methodImplementationString += '}\n';

        return methodImplementationString;
    },

    getPrimaryKeyMethodSignature(entityClass, methodNamePrefix, methodNameString, operatorString, methodParametersDeclarationsString) {
        if(methodNamePrefix === 'findLatestBy') {
            return `${entityClass}DTO ${methodNamePrefix}${methodNameString}${operatorString}(${methodParametersDeclarationsString})`;
        } else {
            return `List<${entityClass}DTO> ${methodNamePrefix}${methodNameString}${operatorString}(${methodParametersDeclarationsString})`;
        }
    },

    getPrimaryKeyRepositoryMethodSignature(entityClass, entityInstanceSnakeCase, methodNamePrefix, methodNameString, operatorString, methodParametersDeclarationsString, methodRepositoryParametersQueryString) {
        if(methodNamePrefix === 'findAllBy') {
            return `List<${entityClass}> ${methodNamePrefix}${methodNameString}${operatorString}(${methodParametersDeclarationsString})`;
        } else if(methodNamePrefix === 'findLatestBy') {
            let methodImplementationString = `@Query("SELECT * FROM ${entityInstanceSnakeCase} WHERE ${methodRepositoryParametersQueryString} LIMIT 1")\n`;
            methodImplementationString += `Optional<${entityClass}> ${methodNamePrefix}${methodNameString}${operatorString}(${methodParametersDeclarationsString});\n`;

            return methodImplementationString;
        }
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