import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const LAST_USED_PORT_FILE = 'last-used-ports.json';

export const cassandraSpringBootUtils = {

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
    },

    /**************************************
     * cassandra-spring-boot-utils Helper Functions
     **************************************/
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
    
    /*********************************
     * entity-spri Helper Functions
     *********************************/
    
    getCompositePrimaryKeyInstanceVariablesFromDTOId(entityInstanceName, primaryKey) {
        return primaryKey.ids.map(pk => `${entityInstanceName}DTO.get${_.upperFirst(primaryKey.name)}().get${_.upperFirst(pk.fieldName)}()`).join(', \n');
    },
    
    getCompositePrimaryKeyNullCheck(entityInstanceName, primaryKey, dtoMapstruct) {
        if (dtoMapstruct) {
        return primaryKey.ids.map(pk => `${entityInstanceName}DTO.get${_.upperFirst(primaryKey.name)}().get${_.upperFirst(pk.fieldName)}() == null`).join(' || \n');
        } else {
        return primaryKey.ids.map(pk => `${entityInstanceName}.get${_.upperFirst(primaryKey.name)}().get${_.upperFirst(pk.fieldName)}() == null`).join(' || \n');
        }
    },
    
    getCompositePrimaryKeyResponseEntityUri(entityInstanceName, primaryKey, dtoMapstruct) {
        if (dtoMapstruct) {
        return primaryKey.ids.map(pk => pk.fieldTypeString ? `getUrlEncodedParameterValue(${entityInstanceName}.get${_.upperFirst(primaryKey.name)}().get${_.upperFirst(pk.fieldName)}())` : `${entityInstanceName}.get${_.upperFirst(primaryKey.name)}().get${_.upperFirst(pk.fieldName)}()`).join(' + "/" + \n');
        } else {
        return primaryKey.ids.map(pk => `${entityInstanceName}.get${_.upperFirst(primaryKey.name)}().get${_.upperFirst(pk.fieldName)}()`).join(' + "/" + \n');
        }
    },
    
    getCompositePrimaryKeyEquivalenceCheck(entityInstanceName, primaryKey, dtoMapstruct) {
        if (dtoMapstruct) {
        return primaryKey.ids.map(pk => `!Objects.equals(${pk.fieldName}, ${entityInstanceName}DTO.get${_.upperFirst(primaryKey.name)}().get${_.upperFirst(pk.fieldName)}())`).join(' || \n');
        } else {
        return primaryKey.ids.map(pk => `!Objects.equals(${pk.fieldName}, ${entityInstanceName}.get${_.upperFirst(primaryKey.name)}().get${_.upperFirst(pk.fieldName)}())`).join(' || \n');
        }
    },
            
    getCompositePrimaryKeyPutPatchGetDeleteMappingJavaDocUrl(primaryKey) {
        return primaryKey.ids.map(pk => `:${pk.fieldName}`).join('/');
    },
    
    getCompositePrimaryKeyPutPatchGetDeleteMappingJavaDocMethodParameters(entityInstanceName, primaryKey, operation) {
        return primaryKey.ids.map(pk => `      * @param ${pk.fieldName} the ${pk.fieldNameHumanized} of the ${entityInstanceName} to ${operation}.`).join('\n');
    },
    
    getCompositePrimaryKeyPutPatchGetDeleteMappingUrl(primaryKey) {
        return primaryKey.ids.map(pk => `{${pk.fieldName}}`).join('/');
    },
    
    getCompositePrimaryKeyInstanceVariables(primaryKey) {
        return primaryKey.ids.map(pk => pk.fieldName).join(', \n');
    },
    
    getCompositePrimaryKeyPutPatchMappingMethodPathVariableParameters(primaryKey) {
        return primaryKey.ids.map(pk => `@PathVariable(value = "${pk.fieldName}", required = true) final ${pk.fieldType} ${pk.fieldName}`).join(', \n');
    },
    
    getCompositePrimaryKeyGetDeleteMappingSetStatements(primaryKey) {
        return primaryKey.ids.map(pk => `${primaryKey.name}.set${_.upperFirst(pk.fieldName)}(${pk.fieldName});`).join('\n');
    },
        
    getCompositePrimaryKeyTestSetIdStatement(fieldStatus, entityInstanceName, entityClassName, primaryKey) {
        return `${entityInstanceName}.set${_.upperFirst(primaryKey.name)}(new ${entityClassName}Id(` + primaryKey.ids.map(pk => `${fieldStatus}${pk.fieldNameUnderscored.toUpperCase()}`).join(', ') + '));';
    },
    
    getCompositePrimaryKeyServerUrl(entityInstanceName, primaryKey) {
        return primaryKey.ids.map(pk => `${entityInstanceName}.get${_.upperFirst(primaryKey.name)}().get${_.upperFirst(pk.fieldName)}()`).join(' + "/" + ');
    },

    isCompositePrimaryKeyServerReference(primaryKey, reference) {
        if(!primaryKey || !reference) { return false; }
        
        const primaryKeyFieldNames = primaryKey.ids.map(pk => pk.fieldName);
        return primaryKeyFieldNames.includes(reference.name);
    },

    isCompositePrimaryKeyServerProperty(primaryKey, property) {
        if(!primaryKey || !property) { return false; }
        
        const primaryKeyFieldNames = primaryKey.ids.map(pk => pk.fieldName);
        return primaryKeyFieldNames.includes(property.propertyName);
    },

    setSaathratriPrimaryKeyAttributesOnEntityAndFields(entity) {
        
        this.initializeSaathratriPrimaryKeyAttributes(entity);

        this.initializeSaathratriFieldAttributes(entity);

        this.sortIdsByOrdinal(entity);
    },

    sortIdsByOrdinal(entity) {
        // Sort the ids array by fieldOrdinalSaathratri
        if(entity.primaryKeySaathratri.ids.length > 1) {
        entity.primaryKeySaathratri.ids.sort((a, b) => a.fieldOrdinalSaathratri - b.fieldOrdinalSaathratri);
        }
    },

    initializeSaathratriPrimaryKeyAttributes(entity) {
        if (!entity.primaryKeySaathratri) {
        entity.primaryKeySaathratri = { composite: false, ids: [] };
        
        entity.fields.forEach(field => {
            this.processFieldForPrimaryKey(entity, field);
            field.fieldJavaValueGenerator = this.getJavaValueGeneratorForType(field.fieldType);
        });
        }
    },
    
    processFieldForPrimaryKey(entity, field) {
        const primaryKeyType = field.options?.customAnnotation[0];
    
        if (primaryKeyType === "PrimaryKeyType.PARTITIONED") {
        this.handlePartitionedKey(entity, field);
        } else if (primaryKeyType === "PrimaryKeyType.CLUSTERED") {
        this.handleClusteredKey(entity, field);
        }

        field.fieldValidationRequiredSaathratri = true;
    },
    
    handlePartitionedKey(entity, field) {
        entity.primaryKeySaathratri.composite = false;
        entity.primaryKeySaathratri.ids.push(field);
        field.isCompositePrimaryKeyField = true;
        field.isPartitionedKeySaathratri = true;
        field.isClusteredKeySaathratri = false;
    },
    
    handleClusteredKey(entity, field) {
        entity.primaryKeySaathratri.composite = true;
        entity.primaryKeySaathratri.nameCapitalized = "CompositeId";
        entity.primaryKeySaathratri.name = "compositeId";
        entity.primaryKeySaathratri.type = `${entity.name}Id`;
        entity.primaryKeySaathratri.typeString = false;
        
        if (field.fieldType === "Long") {
        entity.primaryKeySaathratri.hasLong = true;
        } else if (field.fieldType === "Integer") {
        entity.primaryKeySaathratri.hasInteger = true;
        } else if (field.fieldType === "UUID") {
        entity.primaryKeySaathratri.hasUUID = true;
        }
    
        entity.primaryKeySaathratri.ids.push(field);
        field.isCompositePrimaryKeyField = true;
        field.isPartitionedKeySaathratri = false;
        field.isClusteredKeySaathratri = true;
    },  

    initializeSaathratriFieldAttributes(entity) {
        for (const field of entity.fields) {
        if (!field.hidden) {
            this.processEntityAttributes(entity, field);
            this.processFieldTypeAttributes(field);
        }
        }
    },
    
    processEntityAttributes(entity, field) {
        if (entity?.anyFieldIsDateDerivedSaathratri !== true) {
        if (this.isDateField(field)) {
            field.fieldTypeTemporal = true;
            entity.anyFieldIsDateDerivedSaathratri = true;
        } else {
            entity.anyFieldIsDateDerivedSaathratri = false;
        }
        }
        
        if (entity?.anyFieldIsTimeDerivedSaathratri !== true) {
        if (this.isTimeField(field)) {
            field.fieldTypeTemporal = true;
            entity.anyFieldIsTimeDerivedSaathratri = true;
            // Any field which is time derived is also date derived.
            entity.anyFieldIsDateDerivedSaathratri = true;
        } else {
            entity.anyFieldIsTimeDerivedSaathratri = false;
        }
        }

        if (entity?.anyFieldHasImageContentType !== true) {
        if(this.isBlobFieldContentType(field, 'image')) { 
            field.fieldTypeBlobContent = 'image';
            field.fieldTypeByteBuffer = true;
            field.fieldWithContentType = true;
            field.fieldTypeBinarySaathratri = true;
            field.blobContentTypeTextSaathratri = false;
            field.blobContentTypeImage = true;
            entity.anyFieldHasImageContentType = true;
            entity.anyFieldHasFileBasedContentType = true;
            entity.anyFieldIsBlobDerived = true;
        } else  {
            entity.anyFieldHasImageContentType = false;
        }
        }

        if (entity?.anyFieldHasTextContentType !== true) {
        if(this.isBlobFieldContentType(field, 'text')) {
            field.fieldTypeBlobContent = 'text';
            field.fieldTypeByteBuffer = true;
            field.fieldWithContentType = true;
            field.fieldTypeBinarySaathratri = true;
            field.blobContentTypeTextSaathratri = true;
            field.javaValueSample1 = `"${field.fieldName}1"`;
            entity.anyFieldHasTextContentType = true;
            entity.anyFieldIsBlobDerived = true;
        } else  {
            entity.anyFieldHasTextContentType = false;
        }
        }
    },
    
    isDateField(field) {
        const annotation = field.options?.customAnnotation[2];
        return annotation === "UTC_DATE" ;
    },
    
    isTimeField(field) {
        const annotation = field.options?.customAnnotation[2];
        return annotation === "UTC_DATETIME";
    },

    isBlobFieldContentType(field, contentType) {
        const cassandraNameAnnotation = field.options?.customAnnotation[1];
        const contentTypeAnnotation = field.options?.customAnnotation[2];

        return cassandraNameAnnotation === "CassandraType.Name.BLOB" && contentTypeAnnotation === contentType;
    },

    processFieldTypeAttributes(field) {
        if (field.options?.customAnnotation[0] === "CassandraType.Name.SET") {
        field.fieldTypeSetSaathratri = true;
        }

        if (field.options?.customAnnotation[2] === "UTC_DATE") {
        field.fieldTypeLocalDateSaathratri = true;
        field.fieldContainsUtcSaathratri = true;
        } else if (field.options?.customAnnotation[2] === "UTC_DATETIME") {
        field.fieldTypeTimedSaathratri = true;
        field.fieldContainsUtcSaathratri = true;
        }

        if (field.options?.customAnnotation[3]) {
        field.fieldOrdinalSaathratri = field.options.customAnnotation[3];
        }
    },  

    getJavaValueGeneratorForType(type) {
        // Check for specific types and return their respective value generation expressions
        if (type === "String") {
            return "UUID.randomUUID().toString()";
        } else if (type === "UUID") {
            return "UUID.randomUUID()";
        } else if (type === "Integer") {
            return "intCount.incrementAndGet()";
        } else if (type === "Long") {
            return "longCount.incrementAndGet()";
        } else if (type === "Boolean") {
            return "false";
        } else {
            // Optionally, handle unknown or unsupported types
            return "UnsupportedType";
        }
    },

    getLastUsedPortsFile( destinationPath ) {
        return path.join(destinationPath, '..', LAST_USED_PORT_FILE);
    },

    getApplicationPortData(destinationPath, appName) {
        // Path to the last-used-port.json file
        const portFilePath = this.getLastUsedPortsFile(destinationPath);

        // Read the last used port
        let portData;
        try {
            portData = JSON.parse(fs.readFileSync(portFilePath, 'utf8'));

        } catch (error) {
            portData = {};
        }

        // Ensure the appName key exists
        if (!portData.lastUsedInterNodeCommunicationNonSslPort ||
            !portData.lastUsedInterNodeCommunicationSslPort ||
            !portData.lastUsedJmxMonitoringPort ||
            !portData.lastUsedNativeTransportCqlPort ||
            !portData.lastUsedThriftTransportPort) {

            portData.lastUsedInterNodeCommunicationNonSslPort = 7000;
            portData.lastUsedInterNodeCommunicationSslPort = 7001;
            portData.lastUsedJmxMonitoringPort = 7199;
            portData.lastUsedNativeTransportCqlPort = 9042;
            portData.lastUsedThriftTransportPort = 9160;
        }

        // Write the last used port
        fs.writeFileSync(portFilePath, JSON.stringify(portData, null, 2));
        
        return portData;
    },

    incrementAndSetLastUsedPort(destinationPath, appName) {
        // Path to the last-used-port.json file
        const portFilePath = this.getLastUsedPortsFile(destinationPath);

        // Read the last used port
        let portData;
        try {
            portData = JSON.parse(fs.readFileSync(portFilePath, 'utf8'));

            // Check if the appName exists in portData
            if (!portData[appName]) {
            portData[appName] = {
                interNodeCommunicationNonSslPort: portData.lastUsedInterNodeCommunicationNonSslPort,
                interNodeCommunicationSslPort: portData.lastUsedInterNodeCommunicationSslPort,
                jmxMonitoringPort: portData.lastUsedJmxMonitoringPort,
                nativeTransportCqlPort: portData.lastUsedNativeTransportCqlPort,
                thriftTransportPort: portData.lastUsedThriftTransportPort
            };

            // Increment the last used port for the next microservice
            portData.lastUsedInterNodeCommunicationNonSslPort += 100;
            portData.lastUsedInterNodeCommunicationSslPort += 100;
            portData.lastUsedJmxMonitoringPort += 100;
            portData.lastUsedNativeTransportCqlPort += 100;
            portData.lastUsedThriftTransportPort += 100;

            }

            // Write the updated port data to the file
            fs.writeFileSync(portFilePath, JSON.stringify(portData, null, 2));

            return portData;
        } catch (error) {
            console.error(`Failed to update port data: ${error.message}`);
            throw error;
        }
    }
 }