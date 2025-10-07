export interface District {
  id: string;
  name: string;
  state: string;
  stateCode: string;
}

export interface State {
  name: string;
  code: string;
  districts: District[];
}

export interface Location {
  latitude: number;
  longitude: number;
  district?: string;
  state?: string;
}
