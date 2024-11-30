import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import command from './command.js';
import { generateEntityClientFields, generateEntityClientEnumImports, clientRootTemplatesBlock, clientApplicationTemplatesBlock, clientSrcTemplatesBlock, generateEntityClientImports } from 'generator-jhipster/generators/client/support';
import { cassandraSpringBootUtils } from '../cassandra-spring-boot/cassandra-spring-boot-utils.js';
import { angularSaathratriUtils } from './cassandra-angular-utils.js';

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
      async composeTask() {
        if (['angularX', 'angular'].includes(this.jhipsterConfigWithDefaults.clientFramework)) {
         // Delegate the client sub-generator to the angular blueprint.
         await this.composeWithJHipster('jhipster-cassandra-composite-primary-key:cassandra-languages');
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
        cassandraSpringBootUtils.setSaathratriPrimaryKeyAttributesOnEntityAndFields(entity);
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
      async writingTemplateTask({ application }) {
        await this.writeFiles({
          sections: {
            files: [
              { 
                templates: ['template-file-cassandra-angular'] 
              },
              {
                ...clientRootTemplatesBlock(),
                templates: [
                  'package.json',
                ]
              },
              {
                ...clientSrcTemplatesBlock(),
                templates: [
                  'content/scss/global.scss',
                ]
              },
              {
                ...clientApplicationTemplatesBlock(),
                templates: [
                  'app.config.ts',
                  'shared/shared.module.ts',
                  'shared/date/convert-from-date-long-to-dayjs.pipe.ts',
                  'shared/date/convert-from-dayjs-to-date-long.pipe.ts',
                  'shared/date/format-medium-datetime.pipe.ts',
                  'shared/date/index.ts',
                  'shared/date/saathratri-local-dayjs-and-utc-unix-utils.ts'
                ]
              },
            ],
          },
          context: application
        });
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
                  condition: generator => !generator.embedded && generator.databaseTypeCassandra && !entity.skipClient,
                  ...clientApplicationTemplatesBlock(),
                  templates: [
                    //'entities/_entityFolder_/_entityFile_.routes.ts',
                    'entities/_entityFolder_/detail/_entityFile_-detail.component.html',
                    'entities/_entityFolder_/detail/_entityFile_-detail.component.ts',
                    //'entities/_entityFolder_/detail/_entityFile_-detail.component.spec.ts',
                    'entities/_entityFolder_/list/_entityFile_.component.html',
                    'entities/_entityFolder_/list/_entityFile_.component.ts',
                    //'entities/_entityFolder_/list/_entityFile_.component.spec.ts',
                    'entities/_entityFolder_/route/_entityFile_-routing-resolve.service.ts',
                    //'entities/_entityFolder_/route/_entityFile_-routing-resolve.service.spec.ts',
                    
                    // Entity Service Files:
                    'entities/_entityFolder_/service/_entityFile_.service.ts', 
                    //'entities/_entityFolder_/service/_entityFile_.service.spec.ts
                    
                    // Entity Model Files:
                    'entities/_entityFolder_/_entityFile_.model.ts', 
                    //'entities/_entityFolder_/_entityFile_.test-samples.ts'

                    // Entity Route File:
                    'entities/_entityFolder_/_entityFile_.routes.ts',
                  ]
                },
                {
                  condition: generator => !generator.readOnly && !generator.embedded && generator.databaseTypeCassandra && !entity.skipClient,
                  ...clientApplicationTemplatesBlock(),
                  templates: [
                    'entities/_entityFolder_/update/_entityFile_-form.service.ts',
                    //'entities/_entityFolder_/update/_entityFile_-form.service.spec.ts',
                    'entities/_entityFolder_/update/_entityFile_-update.component.html',
                    //'entities/_entityFolder_/update/_entityFile_-update.component.spec.ts',
                    'entities/_entityFolder_/delete/_entityFile_-delete-dialog.component.html',
                    'entities/_entityFolder_/update/_entityFile_-update.component.ts',
                    'entities/_entityFolder_/delete/_entityFile_-delete-dialog.component.ts',
                    //'entities/_entityFolder_/delete/_entityFile_-delete-dialog.component.spec.ts',
                  ]
                },
              ],
            },
            context: { ...application, ...entity, ...angularSaathratriUtils, generateEntityClientFields, generateEntityClientEnumImports, generateEntityClientImports },
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
