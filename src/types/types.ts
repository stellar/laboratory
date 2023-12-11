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

export interface AnyObject {
  [key: string]: any;
}

export interface StatusPageComponent {
  [key: string]: any;
  id: string;
  name: string;
}

export interface StatusPageIncident {
  [key: string]: any;
  id: string;
  name: string;
  body: string;
}

export interface StatusPageScheduled {
  [key: string]: any;
  id: string;
  name: string;
  scheduled_for: string;
  components: StatusPageComponent[];
  incident_updates: StatusPageIncident[];
}

export interface EndpointItemEndpoint {
  label: string;
  helpUrl: string;
  method: RequestMethod;
  disableStreaming?: boolean;
  path: {
    // TODO: make it one type only if possible (remove function type)
    [key: string]: string | any;
  };
  setupComponent: React.ElementType;
}

export interface EndpointItemProps {
  label: string;
  endpoints: {
    [key: string]: EndpointItemEndpoint;
  };
}

export interface EndpointBuildRequest {
  url: string;
  formData: string;
  method?: RequestMethod;
  streaming?: boolean;
}

export interface NumberFractionValue {
  n: number;
  d: number;
}

export interface Asset {
  code: string;
  issuer: string;
}

export interface AssetWithType extends Asset {
  type: string;
}

export type TransactionNodeValue = {
  parsed: number;
  raw: Uint8Array;
  type: string;
  value: TransactionNodeValue;
  isValid: string;
};

export type TransactionNode = {
  state: string;
  type: string;
  value: TransactionNodeValue;
  nodes: TransactionNode[];
};
