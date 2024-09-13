import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { javaMainPackageTemplatesBlock, javaTestPackageTemplatesBlock } from 'generator-jhipster/generators/java/support';
import command from './command.js';
import { cassandraServerUtils } from './cassandra-server-utils.js';
import { buildJavaGetter, buildJavaSetter, buildJavaGet, getPrimaryKeyValue } from 'generator-jhipster/generators/server/support';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.INITIALIZING]() {
    return this.asInitializingTaskGroup({
      async initializingTemplateTask() {
        this.parseJHipsterArguments(command.arguments);
        this.parseJHipsterOptions(command.options);
      },
    });
  }

  get [BaseApplicationGenerator.PROMPTING]() {
    return this.asPromptingTaskGroup({
      async promptingTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.CONFIGURING]() {
    return this.asConfiguringTaskGroup({
      async configuringTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      async composingTemplateTask() {
        if (['cassandra'].includes(this.jhipsterConfigWithDefaults.databaseType)) {
          // Delegate the client sub-generator to the angular blueprint.
          await this.composeWithJHipster('jhipster-cassandra-composite-primary-key:cassandra-java');
         }
      },
    });
  }

  get [BaseApplicationGenerator.LOADING]() {
    return this.asLoadingTaskGroup({
      async loadingTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      async preparingTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.CONFIGURING_EACH_ENTITY]() {
    return this.asConfiguringEachEntityTaskGroup({
      async configuringEachEntityTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.LOADING_ENTITIES]() {
    return this.asLoadingEntitiesTaskGroup({
      async loadingEntitiesTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.PREPARING_EACH_ENTITY]() {
    return this.asPreparingEachEntityTaskGroup({
      async preparingEachEntityTemplateTask( { entity } ) {
        cassandraServerUtils.setSaathratriPrimaryKeyAttributesOnEntityAndFields(entity);
      },
    });
  }

  get [BaseApplicationGenerator.PREPARING_EACH_ENTITY_FIELD]() {
    return this.asPreparingEachEntityFieldTaskGroup({
      async preparingEachEntityFieldTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.PREPARING_EACH_ENTITY_RELATIONSHIP]() {
    return this.asPreparingEachEntityRelationshipTaskGroup({
      async preparingEachEntityRelationshipTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.POST_PREPARING_EACH_ENTITY]() {
    return this.asPostPreparingEachEntityTaskGroup({
      async postPreparingEachEntityTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.DEFAULT]() {
    return this.asDefaultTaskGroup({
      async defaultTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      async writingTemplateTask( { application } ) {

        if (application.applicationTypeMicroservice) {

          cassandraServerUtils.getApplicationPortData(this.destinationPath(), this.appname);

          // Increment the last used port and set it in the port data
          const portData = cassandraServerUtils.incrementAndSetLastUsedPort(this.destinationPath(), this.appname);

          // Usage of the ports in your configuration files
          this.log(`The server ports are: ${JSON.stringify(portData[this.appname])}`);

          await this.writeFiles({
            sections: {
              files: [{ templates: [
                  'src/main/resources/config/application-dev.yml'
                ] 
              }],
            },
            context: {
              ...application,
              nativeTransportCqlPortSaathratri: portData[this.appname].nativeTransportCqlPort,
            }
          });
        }
      },
    });
  }

  get [BaseApplicationGenerator.WRITING_ENTITIES]() {
    return this.asWritingEntitiesTaskGroup({
      async writingEntitiesTemplateTask({ application, entities }) {
        
        for (const entity of entities.filter(e => !e.builtIn)) { 

          await this.writeFiles({
            sections: {
              files: [
                {
                  condition: generator => generator.databaseTypeCassandra && !entity.skipServer && entity.primaryKeySaathratri.composite,
                  ...javaMainPackageTemplatesBlock('_entityPackage_/'),
                  templates: [
                    'service/dto/_dtoClass_Id.java',
                    /* saathratri-needle-cassandra-copy-dto-id-class */
                  ]
                },
                {
                  condition: generator => generator.databaseTypeCassandra && !entity.skipServer,
                  ...javaMainPackageTemplatesBlock('_entityPackage_/'),
                  templates: [
                    'service/dto/_dtoClass_.java',
                    /* saathratri-needle-cassandra-copy-dto-class */
                    'service/mapper/_entityClass_Mapper.java',
                  ]
                },
                {
                  condition: generator => generator.databaseTypeCassandra && !entity.skipServer,
                  ...javaTestPackageTemplatesBlock('_entityPackage_/'),
                  templates: [
                    'service/dto/_dtoClass_Test.java',
                  ]
                }
              ],
            },
            context: { ...application, ...entity, ...cassandraServerUtils, buildJavaGetter, buildJavaSetter, buildJavaGet, getPrimaryKeyValue },
          });
        }
      },
    });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      async postWritingTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.POST_WRITING_ENTITIES]() {
    return this.asPostWritingEntitiesTaskGroup({
      async postWritingEntitiesTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.LOADING_TRANSLATIONS]() {
    return this.asLoadingTranslationsTaskGroup({
      async loadingTranslationsTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.INSTALL]() {
    return this.asInstallTaskGroup({
      async installTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.POST_INSTALL]() {
    return this.asPostInstallTaskGroup({
      async postInstallTemplateTask() {},
    });
  }

  get [BaseApplicationGenerator.END]() {
    return this.asEndTaskGroup({
      async endTemplateTask() {},
    });
  }
}
