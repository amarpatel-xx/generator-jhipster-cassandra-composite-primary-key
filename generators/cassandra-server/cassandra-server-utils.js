import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const LAST_USED_PORT_FILE = 'last-used-ports.json';

export const cassandraServerUtils = {
    
  /**************************************
   * cassandra-server-utils Helper Functions
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
   * entity-server Helper Functions
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

  getLastUsedPorts(destinationPath) {
    // Path to the last-used-port.json file
    const portFilePath = this.getLastUsedPortsFile(destinationPath);

    // Read the last used port
    let portData;
    
    try {
        portData = JSON.parse(fs.readFileSync(portFilePath, 'utf8'));
    
    } catch (error) {
      portData = {};

      portData.lastUsedInterNodeCommunicationNonSslPort = 7000;
      portData.lastUsedInterNodeCommunicationSslPort = 7001;
      portData.lastUsedJmxMonitoringPort = 7199;
      portData.lastUsedNativeTransportCqlPort = 9042;
      portData.lastUsedThriftTransportPort = 9160;

      // Write the last used port
      fs.writeFileSync(portFilePath, JSON.stringify(portData, null, 2));
    }

    return { 
      lastUsedInterNodeCommunicationNonSslPort: portData.lastUsedInterNodeCommunicationNonSslPort,
      lastUsedInterNodeCommunicationSslPort: portData.lastUsedInterNodeCommunicationSslPort,
      lastUsedJmxMonitoringPort: portData.lastUsedJmxMonitoringPort,
      lastUsedNativeTransportCqlPort: portData.lastUsedNativeTransportCqlPort,
      lastUsedThriftTransportPort: portData.lastUsedThriftTransportPort
    };
  },

  setLastUsedPorts(destinationPath, ports, appName) {
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
    if (!portData[appName]) {
        portData[appName] = {};
    }

    // Update the app ports
    portData[appName]= {
      interNodeCommunicationNonSslPort: ports.lastUsedInterNodeCommunicationNonSslPort,
      interNodeCommunicationSslPort: ports.lastUsedInterNodeCommunicationSslPort,
      jmxMonitoringPort: ports.lastUsedJmxMonitoringPort,
      nativeTransportCqlPort: ports.lastUsedNativeTransportCqlPort,
      thriftTransportPort: ports.lastUsedThriftTransportPort
    };

    // Update the last used ports
    portData.lastUsedInterNodeCommunicationNonSslPort = ports.lastUsedInterNodeCommunicationNonSslPort;
    portData.lastUsedInterNodeCommunicationSslPort = ports.lastUsedInterNodeCommunicationSslPort;
    portData.lastUsedJmxMonitoringPort = ports.lastUsedJmxMonitoringPort;
    portData.lastUsedNativeTransportCqlPort = ports.lastUsedNativeTransportCqlPort;
    portData.lastUsedThriftTransportPort = ports.lastUsedThriftTransportPort;

    // Write the last used port
    fs.writeFileSync(portFilePath, JSON.stringify(portData, null, 2));
  },

  getApplicationPorts(destinationPath, appName) {
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
    if (!portData[appName]) {
        portData[appName] = {
          interNodeCommunicationNonSslPort: 7000,
          interNodeCommunicationSslPort: 7001,
          jmxMonitoringPort: 7199,
          nativeTransportCqlPort: 9042,
          thriftTransportPort: 9160
        }
    }

    // Write the last used port
    fs.writeFileSync(portFilePath, JSON.stringify(portData, null, 2));
    
    return {
        interNodeCommunicationNonSslPort: portData[appName].interNodeCommunicationNonSslPort,
        interNodeCommunicationSslPort: portData[appName].interNodeCommunicationSslPort,
        jmxMonitoringPort: portData[appName].jmxMonitoringPort,
        nativeTransportCqlPort: portData[appName].nativeTransportCqlPort,
        thriftTransportPort: portData[appName].thriftTransportPort
    };
  }
}