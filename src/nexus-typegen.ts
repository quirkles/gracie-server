/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import { Context } from "./api/context"




declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  CreateMediaInput: { // input type
    caption?: string | null; // String
    title: string; // String!
    type?: NexusGenEnums['MediaType'] | null; // MediaType
    url: string; // String!
  }
  CreatePostInput: { // input type
    body?: string | null; // String
    media?: Array<NexusGenInputs['CreateMediaInput'] | null> | null; // [CreateMediaInput]
    title: string; // String!
  }
  GetUploadSignedUrlInput: { // input type
    bucketName: string; // String!
    fileName: string; // String!
  }
}

export interface NexusGenEnums {
  MediaType: "IMAGE"
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
  Media: { // root type
    caption?: string | null; // String
    id?: string | null; // String
    title?: string | null; // String
    type?: string | null; // String
  }
  Mutation: {};
  Post: { // root type
    body?: string | null; // String
    id?: string | null; // String
    title?: string | null; // String
  }
  Query: {};
  Role: { // root type
    id?: string | null; // String
    name?: string | null; // String
  }
  Unauthorized: { // root type
    message?: string | null; // String
    reason?: string | null; // String
  }
  User: { // root type
    id?: string | null; // String
    name?: string | null; // String
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
  AuthorizeResponse: NexusGenRootTypes['UserNotFound'] | NexusGenRootTypes['UserWithToken'];
  CreatePostResponse: NexusGenRootTypes['BadInput'] | NexusGenRootTypes['Post'] | NexusGenRootTypes['Unauthorized'];
  CreateUserResponse: NexusGenRootTypes['BadInput'] | NexusGenRootTypes['Unauthorized'] | NexusGenRootTypes['User'];
}

export type NexusGenRootTypes = NexusGenObjects & NexusGenUnions

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  BadInput: { // field return type
    message: string | null; // String
    reason: string | null; // String
  }
  Media: { // field return type
    caption: string | null; // String
    id: string | null; // String
    title: string | null; // String
    type: string | null; // String
  }
  Mutation: { // field return type
    authorize: NexusGenRootTypes['AuthorizeResponse'] | null; // AuthorizeResponse
    createPost: NexusGenRootTypes['CreatePostResponse'] | null; // CreatePostResponse
    createUser: NexusGenRootTypes['CreateUserResponse'] | null; // CreateUserResponse
  }
  Post: { // field return type
    body: string | null; // String
    contributors: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    id: string | null; // String
    title: string | null; // String
  }
  Query: { // field return type
    encryptTest: string; // String!
    getRoles: Array<NexusGenRootTypes['Role'] | null>; // [Role]!
    getUploadSignedUrl: string; // String!
    getUserById: NexusGenRootTypes['User']; // User!
  }
  Role: { // field return type
    id: string | null; // String
    name: string | null; // String
  }
  Unauthorized: { // field return type
    message: string | null; // String
    reason: string | null; // String
  }
  User: { // field return type
    id: string | null; // String
    name: string | null; // String
    role: NexusGenRootTypes['Role'] | null; // Role
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
  Media: { // field return type name
    caption: 'String'
    id: 'String'
    title: 'String'
    type: 'String'
  }
  Mutation: { // field return type name
    authorize: 'AuthorizeResponse'
    createPost: 'CreatePostResponse'
    createUser: 'CreateUserResponse'
  }
  Post: { // field return type name
    body: 'String'
    contributors: 'User'
    id: 'String'
    title: 'String'
  }
  Query: { // field return type name
    encryptTest: 'String'
    getRoles: 'Role'
    getUploadSignedUrl: 'String'
    getUserById: 'User'
  }
  Role: { // field return type name
    id: 'String'
    name: 'String'
  }
  Unauthorized: { // field return type name
    message: 'String'
    reason: 'String'
  }
  User: { // field return type name
    id: 'String'
    name: 'String'
    role: 'Role'
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
    createPost: { // args
      input: NexusGenInputs['CreatePostInput']; // CreatePostInput!
    }
    createUser: { // args
      input?: NexusGenInputs['CreateMediaInput'] | null; // CreateMediaInput
    }
  }
  Query: {
    encryptTest: { // args
      text: string; // String!
    }
    getUploadSignedUrl: { // args
      input: NexusGenInputs['GetUploadSignedUrlInput']; // GetUploadSignedUrlInput!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
  AuthorizeResponse: "UserNotFound" | "UserWithToken"
  CreatePostResponse: "BadInput" | "Post" | "Unauthorized"
  CreateUserResponse: "BadInput" | "Unauthorized" | "User"
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

export type NexusGenAbstractsUsingStrategyResolveType = "AuthorizeResponse" | "CreatePostResponse" | "CreateUserResponse";

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
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}