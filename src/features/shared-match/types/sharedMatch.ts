export type SharedMatchAction =
  | "share"
  | "leaning"
  | "bet";

export type SharedMatchSide =
  | "home"
  | "away";

export interface SharedMatchSource {
  provider:
    string;

  externalId:
    string;
}

export interface SharedMatchSnapshot {
  sources:
    SharedMatchSource[];

  kickoffAt:
    string;

  competitionName:
    string | null;

  country:
    string | null;

  homeName:
    string;

  awayName:
    string;

  homeGoals:
    number | null;

  awayGoals:
    number | null;

  minute:
    number | null;
}

export interface SharedMatchUser {
  id:
    string;

  username:
    string;
}

export interface SharedMatchInsight {
  _id:
    string;

  groupId:
    string;

  createdBy:
    string;

  action:
    SharedMatchAction;

  selectedSide:
    SharedMatchSide | null;

  note:
    string | null;

  match:
    SharedMatchSnapshot;

  expiresAt:
    string;

  createdAt:
    string;

  updatedAt:
    string;

  createdByUser:
    SharedMatchUser;
}

export interface SharingGroup {
  _id:
    string;

  name:
    string;

  inviteCode:
    string;

  createdBy:
    string;

  memberIds:
    string[];

  createdAt:
    string;

  updatedAt:
    string;
}

export interface SharingGroupResponse {
  group:
    SharingGroup | null;
}

export interface SharedMatchesResponse {
  count:
    number;

  items:
    SharedMatchInsight[];
}
