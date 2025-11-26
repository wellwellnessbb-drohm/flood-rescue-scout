export enum LoadingStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface FloodRescueData {
  location: string;
  contact: string;
  severity: 'Critical' | 'High' | 'Normal';
  needs: string;
  timestamp_context: string;
  number_of_people: string;
  weather_condition: string;
  additional_info: string;
  lastUpdated: number;
}

export interface TabState {
  status: LoadingStatus;
  data: FloodRescueData | null;
  error: string | null;
}

export interface StorageSchema {
  [tabId: string]: TabState;
}

export interface MessagePayload {
  action: 'ANALYZE_REQUEST' | 'SCRAPE_TEXT';
}

export interface ScrapeResponse {
  text: string;
}

export interface SubmittedData extends FloodRescueData {
  id: string;
  submittedAt: number;
  url: string;
}

export interface SubmittedDataStorage {
  submitted: SubmittedData[];
}
