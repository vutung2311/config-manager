import type { Dayjs } from "dayjs";

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
  addresses: IAddress[];
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
  status: "error" | "success" | "done" | "uploading" | "removed";
  type: string;
  uid: string;
  url: string;
}

export interface IConfiguration {
  id: string;
  name: string;
  data: any;
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
