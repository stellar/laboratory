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
