/*
 * In order to compute inverted rules we must have an uncompiled version of Spectrals OAS Ruleset.
 * This is needed to extract properties like path, formats and recommended values for each rule.
 * This is not a valid spectral ruleset. Conflicting properties like function pointers are redacted, paths are always completely
 * resolved. aliases were eliminated.
 * Manually extracted parameter triggers: int indicate how many error messages a rule can throw on one function call
 */
export const aliases = {
  PathItem: ['$.paths[*]'],
  OperationObject: ['$.paths[*][get,put,post,delete,options,head,patch,trace]'],
  SecurityRequirementObject: [
    '$.security[*]',
    '$.paths[*][get,put,post,delete,options,head,patch,trace].security[*]'
  ],
  ResponseObject: [
    '$.paths[*][get,put,post,delete,options,head,patch,trace].responses[*]',
    '$.components.responses[*]'
  ],

  LinkObject: [
    '$.components.links[*]',
    '$.paths[*][get,put,post,delete,options,head,patch,trace].responses[*].links[*]',
    '$.components.responses[*].links[*]'
  ],
  ArrayProperties: ['$..[?(@ && @.type=="array")]']
}

export interface RuleMeta {
  formats: Array<string>
  description: string
  message?: string
  recommended: boolean
  severity: string | number
  given: string[]
  triggers: number
  status: InverseStatus
}

export enum InverseStatus {
  OPENAPI_2_X = 'OPENAPI_2_X',
  SINGLE_TRIGGER = 'SINGLE_TRIGGER',
  MULTI_TRIGGER = 'MULTI_TRIGGER',
  MULTI_MESSAGE = 'MULTI_MESSAGE'
}

export const uncompiledRules: Record<string, RuleMeta> = {
  'operation-success-response': {
    formats: [],
    severity: 2,
    description: 'Operation must have at least one "2xx" or "3xx" response.',
    recommended: true,
    given: ['$.paths[*][get,put,post,delete,options,head,patch,trace]'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'oas2-operation-formData-consume-check': {
    description:
      'Operations with "in: formData" parameter must include "application/x-www-form-urlencoded" or "multipart/form-data" in their "consumes" property.',
    recommended: true,
    severity: 2,
    formats: ['oas2'],
    given: ['$.paths[*][get,put,post,delete,options,head,patch,trace]'],
    triggers: -1,
    status: InverseStatus.OPENAPI_2_X
  },
  'operation-operationId-unique': {
    formats: [],
    description: 'Every operation must have unique "operationId".',
    recommended: true,
    severity: 0,
    given: ['$.paths'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'operation-parameters': {
    formats: [],
    description: 'Operation parameters are unique and non-repeating.',
    message: '{{error}}',
    recommended: true,
    severity: 2,
    given: [
      '$.paths[*][get,put,post,delete,options,head,patch,trace].parameters'
    ],
    triggers: 3,
    status: InverseStatus.MULTI_MESSAGE
  },
  'operation-tag-defined': {
    formats: [],
    description: 'Operation tags must be defined in global tags.',
    severity: 2,
    recommended: true,
    given: ['$'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'path-params': {
    formats: [],
    description: 'Path parameters must be defined and valid.',
    message: '{{error}}',
    severity: 0,
    recommended: true,
    given: ['$.paths'],
    triggers: 6,
    status: InverseStatus.MULTI_MESSAGE
  },
  'contact-properties': {
    formats: [],
    description: 'Contact object must have "name", "url" and "email".',
    recommended: false,
    severity: 2,
    given: ['$.info.contact'],
    triggers: -1,
    status: InverseStatus.SINGLE_TRIGGER
  },
  'duplicated-entry-in-enum': {
    formats: [],
    description: 'Enum values must not have duplicate entry.',
    severity: 2,
    recommended: true,
    message: '{{error}}',
    given: ["$..[?(@property !== 'properties' && @ && @.enum)]"],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'info-contact': {
    formats: [],
    description: 'Info object must have "contact" object.',
    severity: 2,
    recommended: true,
    given: ['$'],
    triggers: -1,
    status: InverseStatus.SINGLE_TRIGGER
  },
  'info-description': {
    formats: [],
    description: 'Info "description" must be present and non-empty string.',
    severity: 2,
    recommended: true,
    given: ['$'],
    triggers: -1,
    status: InverseStatus.SINGLE_TRIGGER
  },
  'info-license': {
    formats: [],
    description: 'Info object must have "license" object.',
    severity: 2,
    recommended: false,
    given: ['$'],
    triggers: -1,
    status: InverseStatus.SINGLE_TRIGGER
  },
  'license-url': {
    formats: [],
    description: 'License object must include "url".',
    severity: 2,
    recommended: false,
    given: ['$'],
    triggers: -1,
    status: InverseStatus.SINGLE_TRIGGER
  },
  'no-eval-in-markdown': {
    formats: [],
    description: 'Markdown descriptions must not have "eval(".',
    severity: 2,
    recommended: true,
    given: ['$..[description,title]'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'no-script-tags-in-markdown': {
    formats: [],
    description: 'Markdown descriptions must not have "<script>" tags.',
    severity: 2,
    recommended: true,
    given: ['$..[description,title]'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'openapi-tags-alphabetical': {
    formats: [],
    description: 'OpenAPI object must have alphabetical "tags".',
    severity: 2,
    recommended: false,
    given: ['$'],
    triggers: -1,
    status: InverseStatus.SINGLE_TRIGGER
  },
  'openapi-tags-uniqueness': {
    formats: [],
    description: 'Each tag must have a unique name.',
    message: '{{error}}',
    severity: 3,
    recommended: true,
    given: ['$.tags'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'openapi-tags': {
    formats: [],
    description: 'OpenAPI object must have non-empty "tags" array.',
    severity: 2,
    recommended: false,
    given: ['$'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'operation-description': {
    formats: [],
    description:
      'Operation "description" must be present and non-empty string.',
    severity: 2,
    recommended: true,
    given: ['$.paths[*][get,put,post,delete,options,head,patch,trace]'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'operation-operationId': {
    formats: [],
    description: 'Operation must have "operationId".',
    severity: 2,
    recommended: true,
    given: ['$.paths[*][get,put,post,delete,options,head,patch,trace]'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'operation-operationId-valid-in-url': {
    formats: [],
    description:
      'operationId must not characters that are invalid when used in URL.',
    message:
      'operationId must not characters that are invalid when used in URL.',
    severity: 2,
    recommended: true,
    given: ['$.paths[*][get,put,post,delete,options,head,patch,trace]'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'operation-singular-tag': {
    formats: [],
    description: 'Operation must not have more than a single tag.',
    severity: 2,
    recommended: false,
    given: ['$.paths[*][get,put,post,delete,options,head,patch,trace]'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'operation-tags': {
    formats: [],
    description: 'Operation must have non-empty "tags" array.',
    severity: 2,
    recommended: true,
    given: ['$.paths[*][get,put,post,delete,options,head,patch,trace]'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'path-declarations-must-exist': {
    formats: [],
    description:
      'Path parameter declarations must not be empty, ex."/given/{}" is invalid.',
    message:
      'Path parameter declarations must not be empty, ex."/given/{}" is invalid.',
    severity: 2,
    recommended: true,
    given: ['$.paths'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'path-keys-no-trailing-slash': {
    formats: [],
    description: 'Path must not end with slash.',
    message: 'Path must not end with slash.',
    severity: 2,
    recommended: true,
    given: ['$.paths'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'path-not-include-query': {
    formats: [],
    description: 'Path must not include query string.',
    severity: 2,
    recommended: true,
    given: ['$.paths'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'tag-description': {
    formats: [],
    description: 'Tag object must have "description".',
    severity: 2,
    recommended: false,
    given: ['$.tags[*]'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'no-$ref-siblings': {
    formats: ['oas2', 'oas3_0'],
    description: 'Property must not be placed among $ref',
    message: '{{error}}',
    severity: 0,
    recommended: true,
    given: ["$..[?(@property === '$ref')]"],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'array-items': {
    formats: [],
    description: 'Schemas with "type: array", require a sibling "items" field',
    message: 'Schemas with "type: array", require a sibling "items" field',
    severity: 0,
    recommended: true,
    given: ['$..[?(@ && @.type=="array")]'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'typed-enum': {
    formats: [],
    description: 'Enum values must respect the specified type.',
    message: '{{error}}',
    severity: 2,
    recommended: true,
    given: ['$..[?(@ && @.enum && @.type)]'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'oas2-api-host': {
    description: 'OpenAPI "host" must be present and non-empty string.',
    recommended: true,
    severity: 2,
    formats: ['oas2'],
    given: ['$'],
    triggers: -1,
    status: InverseStatus.OPENAPI_2_X
  },
  'oas2-api-schemes': {
    description: 'OpenAPI host "schemes" must be present and non-empty array.',
    recommended: true,
    severity: 2,
    formats: ['oas2'],
    given: ['$'],
    triggers: -1,
    status: InverseStatus.OPENAPI_2_X
  },
  'oas2-discriminator': {
    description: 'discriminator property must be defined and required',
    recommended: true,
    formats: ['oas2'],
    severity: 0,
    message: '{{error}}',
    given: ['$.definitions[?(@.discriminator)]'],
    triggers: -1,
    status: InverseStatus.OPENAPI_2_X
  },
  'oas2-host-not-example': {
    description: 'Host URL must not point at example.com.',
    recommended: false,
    severity: 2,
    formats: ['oas2'],
    given: ['$'],
    triggers: -1,
    status: InverseStatus.OPENAPI_2_X
  },
  'oas2-host-trailing-slash': {
    description: 'Server URL must not have trailing slash.',
    recommended: true,
    severity: 2,
    formats: ['oas2'],
    given: ['$'],
    triggers: -1,
    status: InverseStatus.OPENAPI_2_X
  },
  'oas2-parameter-description': {
    description: 'Parameter objects must have "description".',
    recommended: false,
    severity: 2,
    formats: ['oas2'],
    given: ['$..parameters[?(@ && @.in)]'],
    triggers: -1,
    status: InverseStatus.OPENAPI_2_X
  },
  'oas2-operation-security-defined': {
    description:
      'Operation "security" values must match a scheme defined in the "securityDefinitions" object.',
    message: '{{error}}',
    severity: 2,
    recommended: true,
    formats: ['oas2'],
    given: [
      '$.security[*]',
      '$.paths[*][get,put,post,delete,options,head,patch,trace].security[*]'
    ],
    triggers: -1,
    status: InverseStatus.OPENAPI_2_X
  },
  'oas2-valid-schema-example': {
    description: 'Examples must be valid against their defined schema.',
    message: '{{error}}',
    recommended: true,
    formats: ['oas2'],
    severity: 0,
    given: [
      "$..definitions..[?(@property !== 'properties' && @ && (@.example !== void 0 || @['x-example'] !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]",
      "$..parameters..[?(@property !== 'properties' && @ && (@.example !== void 0 || @['x-example'] !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]",
      "$..responses..[?(@property !== 'properties' && @ && (@.example !== void 0 || @['x-example'] !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]"
    ],
    triggers: -1,
    status: InverseStatus.OPENAPI_2_X
  },
  'oas2-valid-media-example': {
    description: 'Examples must be valid against their defined schema.',
    message: '{{error}}',
    recommended: true,
    formats: ['oas2'],
    severity: 0,
    given: ['$..responses..[?(@ && @.schema && @.examples)]'],
    triggers: -1,
    status: InverseStatus.OPENAPI_2_X
  },
  'oas2-anyOf': {
    message: '"anyOf" keyword must not be used in OpenAPI v2 document.',
    description:
      'anyOf is not available in OpenAPI v2, it was added in OpenAPI v3',
    recommended: true,
    severity: 2,
    formats: ['oas2'],
    given: ['$..anyOf'],
    triggers: -1,
    status: InverseStatus.OPENAPI_2_X
  },
  'oas2-oneOf': {
    message: '"oneOf" keyword must not be used in OpenAPI v2 document.',
    description:
      'oneOf is not available in OpenAPI v2, it was added in OpenAPI v3',
    recommended: true,
    severity: 2,
    formats: ['oas2'],
    given: ['$..oneOf'],
    triggers: -1,
    status: InverseStatus.OPENAPI_2_X
  },
  'oas2-schema': {
    description: 'Validate structure of OpenAPI v2 specification.',
    message: '{{error}}.',
    recommended: true,
    formats: ['oas2'],
    severity: 0,
    given: ['$'],
    triggers: -1,
    status: InverseStatus.OPENAPI_2_X
  },
  'oas2-unused-definition': {
    description: 'Potentially unused definition has been detected.',
    recommended: true,
    formats: ['oas2'],
    severity: 2,
    given: ['$.definitions'],
    triggers: -1,
    status: InverseStatus.OPENAPI_2_X
  },
  'oas3-api-servers': {
    description: 'OpenAPI "servers" must be present and non-empty array.',
    recommended: true,
    severity: 2,
    formats: ['oas3'],
    given: ['$'],
    triggers: -1,
    status: InverseStatus.SINGLE_TRIGGER
  },
  'oas3-examples-value-or-externalValue': {
    description: 'Examples must have either "value" or "externalValue" field.',
    recommended: true,
    severity: 2,
    formats: ['oas3'],
    given: [
      '$.components.examples[*]',
      '$.paths[*][*]..content[*].examples[*]',
      '$.paths[*][*]..parameters[*].examples[*]',
      '$.components.parameters[*].examples[*]',
      '$.paths[*][*]..headers[*].examples[*]',
      '$.components.headers[*].examples[*]'
    ],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'oas3-operation-security-defined': {
    description:
      'Operation "security" values must match a scheme defined in the "components.securitySchemes" object.',
    message: '{{error}}',
    severity: 2,
    recommended: true,
    formats: ['oas3'],
    given: [
      '$.security[*]',
      '$.paths[*][get,put,post,delete,options,head,patch,trace].security[*]'
    ],
    triggers: 2,
    status: InverseStatus.MULTI_MESSAGE
  },
  'oas3-parameter-description': {
    description: 'Parameter objects must have "description".',
    recommended: false,
    severity: 2,
    formats: ['oas3'],
    given: [
      '$.paths[*].parameters[?(@ && @.in)]',
      '$.paths[*][get,put,post,delete,options,head,patch,trace].parameters[?(@ && @.in)]',
      '$.components.parameters[?(@ && @.in)]'
    ],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'oas3-server-not-example.com': {
    description: 'Server URL must not point at example.com.',
    recommended: false,
    severity: 2,
    formats: ['oas3'],
    given: ['$.servers[*].url'],
    triggers: -1,
    status: InverseStatus.SINGLE_TRIGGER
  },
  'oas3-server-trailing-slash': {
    description: 'Server URL must not have trailing slash.',
    recommended: true,
    severity: 2,
    formats: ['oas3'],
    given: ['$.servers[*].url'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'oas3-valid-media-example': {
    description: 'Examples must be valid against their defined schema.',
    message: '{{error}}',
    recommended: true,
    severity: 0,
    formats: ['oas3'],
    given: [
      '$..content..[?(@ && @.schema && (@.example !== void 0 || @.examples))]',
      '$..headers..[?(@ && @.schema && (@.example !== void 0 || @.examples))]',
      '$..parameters..[?(@ && @.schema && (@.example !== void 0 || @.examples))]'
    ],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'oas3-valid-schema-example': {
    description: 'Examples must be valid against their defined schema.',
    message: '{{error}}',
    severity: 0,
    formats: ['oas3'],
    recommended: true,
    given: [
      "$.components.schemas..[?(@property !== 'properties' && @ && (@ && @.example !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]",
      "$..content..[?(@property !== 'properties' && @ && (@ && @.example !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]",
      "$..headers..[?(@property !== 'properties' && @ && (@ && @.example !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]",
      "$..parameters..[?(@property !== 'properties' && @ && (@ && @.example !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]"
    ],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'oas3-schema': {
    description: 'Validate structure of OpenAPI v3 specification.',
    message: '{{error}}.',
    severity: 0,
    formats: ['oas3'],
    recommended: true,
    given: ['$'],
    triggers: -1,
    status: InverseStatus.SINGLE_TRIGGER
  },
  'oas3-unused-component': {
    description: 'Potentially unused component has been detected.',
    message: 'Potentially unused component has been detected.',
    severity: 2,
    recommended: true,
    formats: ['oas3'],
    given: ['$'],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'oas3-server-variables': {
    formats: ['oas3'],
    description:
      'Server variables must be defined and valid and there must be no unused variables.',
    message: '{{error}}',
    severity: 0,
    recommended: true,
    given: [
      '$.servers[*]',
      '$.paths[*].servers[*]',
      '$.paths[*][get,put,post,delete,options,head,patch,trace].servers[*]',
      '$.components.links[*].server',
      '$.paths[*][get,put,post,delete,options,head,patch,trace].responses[*].links[*].server',
      '$.components.responses[*].links[*].server'
    ],
    triggers: 6,
    status: InverseStatus.MULTI_MESSAGE
  },
  'oas3-callbacks-in-callbacks': {
    description: 'Callbacks should not be defined within a callback',
    message: 'Callbacks should not be defined within a callback',
    severity: 2,
    formats: ['oas3'],
    recommended: true,
    given: [
      '$.paths[*][get,put,post,delete,options,head,patch,trace].callbacks[*][*][*].callbacks'
    ],
    triggers: -1,
    status: InverseStatus.MULTI_TRIGGER
  },
  'oas3_1-servers-in-webhook': {
    description: 'Servers should not be defined in a webhook.',
    message: 'Servers should not be defined in a webhook.',
    formats: ['oas3_1'],
    severity: 2,
    recommended: true,
    given: ['$.webhooks.servers', '$.webhooks[*][*].servers'],
    triggers: -1,
    status: InverseStatus.OPENAPI_2_X
  },
  'oas3_1-callbacks-in-webhook': {
    description: 'Callbacks should not be defined in a webhook.',
    message: 'Callbacks should not be defined in a webhook.',
    severity: 2,
    formats: ['oas3_1'],
    recommended: true,
    given: ['$.webhooks[*][*].callbacks'],
    triggers: -1,
    status: InverseStatus.OPENAPI_2_X
  }
}
