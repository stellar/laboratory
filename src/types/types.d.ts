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
  path: {
    // TODO: make it one type only if possible (remove function type)
    [key: string]: string | any;
  };
  setupComponent: React.ReactElement;
}

interface EndpointItemProps {
  label: string;
  endpoints: {
    [key: string]: EndpointItemEndpoint;
  };
}
