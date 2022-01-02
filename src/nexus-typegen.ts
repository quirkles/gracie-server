/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./api/context"




declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  GetUploadSignedUrlInput: { // input type
    fileName: string; // String!
  }
  SaveMediaInput: { // input type
    caption?: string | null; // String
    id?: string | null; // String
    title?: string | null; // String
    type: NexusGenEnums['MediaType']; // MediaType!
    url: string; // String!
  }
  SavePostInput: { // input type
    body?: string | null; // String
    date?: string | null; // String
    id?: string | null; // String
    media?: NexusGenInputs['SaveMediaInput'][] | null; // [SaveMediaInput!]
    title: string; // String!
  }
}

export interface NexusGenEnums {
  MediaType: "IMAGE"
  RoleType: "AUNTIE" | "DAD" | "FRIEND" | "GRANDDAD" | "GRANDMA" | "ME" | "MUM" | "NO_RELATION" | "UNCLE"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
}

export interface NexusGenObjects {
  BadInput: { // root type
    message?: string | null; // String
    reason?: string | null; // String
  }
  Edge: { // root type
    node?: NexusGenRootTypes['Post'] | null; // Post
  }
  Media: { // root type
    caption?: string | null; // String
    id?: string | null; // String
    title?: string | null; // String
    type: NexusGenEnums['MediaType']; // MediaType!
    url: string; // String!
  }
  Mutation: {};
  PageInfo: { // root type
    endCursor?: string | null; // String
    hasNextPage?: boolean | null; // Boolean
    hasPreviousPage?: boolean | null; // Boolean
    startCursor?: string | null; // String
  }
  Post: { // root type
    body?: string | null; // String
    date?: string | null; // String
    id?: string | null; // String
    title?: string | null; // String
  }
  PostConnection: { // root type
    edges: Array<NexusGenRootTypes['Edge'] | null>; // [Edge]!
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  Query: {};
  ServerError: { // root type
    message?: string | null; // String
    reason?: string | null; // String
  }
  Unauthorized: { // root type
    message?: string | null; // String
    reason?: string | null; // String
  }
  User: { // root type
    id?: string | null; // String
    name?: string | null; // String
    role?: string | null; // String
  }
  UserNotFound: { // root type
    message?: string | null; // String
  }
  UserWithToken: { // root type
    token?: string | null; // String
    user?: NexusGenRootTypes['User'] | null; // User
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
  AuthorizeResponse: NexusGenRootTypes['ServerError'] | NexusGenRootTypes['UserNotFound'] | NexusGenRootTypes['UserWithToken'];
  CreateUserResponse: NexusGenRootTypes['BadInput'] | NexusGenRootTypes['ServerError'] | NexusGenRootTypes['Unauthorized'] | NexusGenRootTypes['User'];
  SavePostResponse: NexusGenRootTypes['BadInput'] | NexusGenRootTypes['Post'] | NexusGenRootTypes['ServerError'] | NexusGenRootTypes['Unauthorized'];
}

export type NexusGenRootTypes = NexusGenObjects & NexusGenUnions

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  BadInput: { // field return type
    message: string | null; // String
    reason: string | null; // String
  }
  Edge: { // field return type
    node: NexusGenRootTypes['Post'] | null; // Post
  }
  Media: { // field return type
    caption: string | null; // String
    id: string | null; // String
    title: string | null; // String
    type: NexusGenEnums['MediaType']; // MediaType!
    url: string; // String!
  }
  Mutation: { // field return type
    authorize: NexusGenRootTypes['AuthorizeResponse'] | null; // AuthorizeResponse
    createUser: NexusGenRootTypes['CreateUserResponse'] | null; // CreateUserResponse
    savePost: NexusGenRootTypes['SavePostResponse'] | null; // SavePostResponse
  }
  PageInfo: { // field return type
    endCursor: string | null; // String
    hasNextPage: boolean | null; // Boolean
    hasPreviousPage: boolean | null; // Boolean
    startCursor: string | null; // String
  }
  Post: { // field return type
    body: string | null; // String
    contributors: NexusGenRootTypes['User'][] | null; // [User!]
    date: string | null; // String
    id: string | null; // String
    media: NexusGenRootTypes['Media'][] | null; // [Media!]
    title: string | null; // String
  }
  PostConnection: { // field return type
    edges: Array<NexusGenRootTypes['Edge'] | null>; // [Edge]!
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  Query: { // field return type
    encryptTest: string; // String!
    getPostConnection: NexusGenRootTypes['PostConnection']; // PostConnection!
    getRoles: Array<NexusGenEnums['RoleType'] | null>; // [RoleType]!
    getUploadSignedUrl: string; // String!
    validateToken: boolean; // Boolean!
  }
  ServerError: { // field return type
    message: string | null; // String
    reason: string | null; // String
  }
  Unauthorized: { // field return type
    message: string | null; // String
    reason: string | null; // String
  }
  User: { // field return type
    id: string | null; // String
    name: string | null; // String
    role: string | null; // String
  }
  UserNotFound: { // field return type
    message: string | null; // String
  }
  UserWithToken: { // field return type
    token: string | null; // String
    user: NexusGenRootTypes['User'] | null; // User
  }
}

export interface NexusGenFieldTypeNames {
  BadInput: { // field return type name
    message: 'String'
    reason: 'String'
  }
  Edge: { // field return type name
    node: 'Post'
  }
  Media: { // field return type name
    caption: 'String'
    id: 'String'
    title: 'String'
    type: 'MediaType'
    url: 'String'
  }
  Mutation: { // field return type name
    authorize: 'AuthorizeResponse'
    createUser: 'CreateUserResponse'
    savePost: 'SavePostResponse'
  }
  PageInfo: { // field return type name
    endCursor: 'String'
    hasNextPage: 'Boolean'
    hasPreviousPage: 'Boolean'
    startCursor: 'String'
  }
  Post: { // field return type name
    body: 'String'
    contributors: 'User'
    date: 'String'
    id: 'String'
    media: 'Media'
    title: 'String'
  }
  PostConnection: { // field return type name
    edges: 'Edge'
    pageInfo: 'PageInfo'
  }
  Query: { // field return type name
    encryptTest: 'String'
    getPostConnection: 'PostConnection'
    getRoles: 'RoleType'
    getUploadSignedUrl: 'String'
    validateToken: 'Boolean'
  }
  ServerError: { // field return type name
    message: 'String'
    reason: 'String'
  }
  Unauthorized: { // field return type name
    message: 'String'
    reason: 'String'
  }
  User: { // field return type name
    id: 'String'
    name: 'String'
    role: 'String'
  }
  UserNotFound: { // field return type name
    message: 'String'
  }
  UserWithToken: { // field return type name
    token: 'String'
    user: 'User'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    authorize: { // args
      name: string; // String!
      password: string; // String!
    }
    createUser: { // args
      name: string; // String!
      password: string; // String!
      roleName: string; // String!
    }
    savePost: { // args
      input: NexusGenInputs['SavePostInput']; // SavePostInput!
    }
  }
  Query: {
    encryptTest: { // args
      text: string; // String!
    }
    getUploadSignedUrl: { // args
      input: NexusGenInputs['GetUploadSignedUrlInput']; // GetUploadSignedUrlInput!
    }
    validateToken: { // args
      token: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
  AuthorizeResponse: "ServerError" | "UserNotFound" | "UserWithToken"
  CreateUserResponse: "BadInput" | "ServerError" | "Unauthorized" | "User"
  SavePostResponse: "BadInput" | "Post" | "ServerError" | "Unauthorized"
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = keyof NexusGenUnions;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = "AuthorizeResponse" | "CreateUserResponse" | "SavePostResponse";

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}