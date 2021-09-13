import React from "react";

export enum Network {
  PUBLIC = "public",
  TEST = "test",
  CUSTOM = "custom",
}

export enum ActionStatus {
  LOADING = "loading",
  SUCCESS = "success",
  FAILURE = "failure",
}

export enum RequestMethod {
  GET = "GET",
  POST = "POST",
}

interface AnyObject {
  [key: string]: any;
}

interface StatusPageComponent {
  [key: string]: any;
  id: string;
  name: string;
}

interface StatusPageIncident {
  [key: string]: any;
  id: string;
  name: string;
  body: string;
}

interface StatusPageScheduled {
  [key: string]: any;
  id: string;
  name: string;
  scheduled_for: string;
  components: StatusPageComponent[];
  incident_updates: StatusPageIncident[];
}

interface EndpointItemEndpoint {
  label: string;
  helpUrl: string;
  method: RequestMethod;
  disableStreaming?: boolean;
  path: {
    // TODO: make it one type only if possible (remove function type)
    [key: string]: string | any;
  };
  setupComponent: JSX.ElementElement;
}

interface EndpointItemProps {
  label: string;
  endpoints: {
    [key: string]: EndpointItemEndpoint;
  };
}

interface EndpointBuildRequest {
  url: string;
  formData: string;
  method?: RequestMethod;
  streaming?: boolean;
}

interface NumberFractionValue {
  n: number;
  d: number;
}

interface Asset {
  code: string;
  issuer: string;
}
