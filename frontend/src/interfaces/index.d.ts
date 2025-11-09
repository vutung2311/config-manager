import type { Dayjs } from 'dayjs';

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: string;
  gsm: string;
  createdAt: string;
  isActive: boolean;
  avatar: IFile[];
}

export interface IIdentity {
  id: number;
  name: string;
  avatar: string;
}

export interface IFile {
  name: string;
  percent: number;
  size: number;
  status: 'error' | 'success' | 'done' | 'uploading' | 'removed';
  type: string;
  uid: string;
  url: string;
}

export interface IConfiguration {
  id: string;
  name: string;
  data: any;
  game_id: string;
  template_id: string;
  is_latest: boolean;
  created: string;
  updated: string;
}

export interface IConfigurationFilterVariables {
  name?: string;
}

export interface IConfigurationTemplate {
  id: string;
  name: string;
  data: any;
  game_id: string;
  created: string;
  updated: string;
}

export interface IConfigurationTemplateFilterVariables {
  game_id?: string;
}

export interface IGame {
  id: string;
  game_id: string;
  created: string;
}

export interface IGameFilterVariables {
  game_id?: string;
}

export interface IAdvertisementConfig {
  id: string;
  name: string;
  experiment_id: string;
  game_id: string[];
  banner_ad_unit_id?: string;
  interstitial_ad_unit_id?: string;
  rewarded_ad_unit_id?: string;
  auto_hide_banner?: boolean;
  banner_position?: number;
  banner_refresh_rate?: number;
  banner_memory_threshold?: number;
  destroy_banner_on_low_memory?: boolean;
  preload_interstitial?: boolean;
  preload_rewarded?: boolean;
  enable_consent_flow?: boolean;
  created: string;
  updated: string;
}

export interface IAdvertisementConfigFilterVariables {
  name?: string;
  experiment_id?: string;
}

export interface IAdvertisementPlacement {
  id: string;
  advertisement_id: string;
  placement_id: string;
  data: any;
  ad_format?: number;
  action?: number;
  min_level?: number;
  time_between?: number;
  show_loading?: boolean;
  time_out?: number;
  retry?: number;
  show_ad_notice?: boolean;
  delay_time?: number;
  custom_ad_unit_id?: string;
  created: string;
  updated: string;
}

export interface IAdvertisementPlacementFilterVariables {
  placement_id?: string;
  advertisement_id?: string;
}
