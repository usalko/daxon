/*******************************************************************************
 *
 *  Copyright (c) 2014-2019 Appsicle
 *  Copyright (c) 2019-2022 PostgresDB
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 ******************************************************************************/

import type { ReactNode } from "react"

import type {
  QueryRawResult,
  Table,
  InformationSchemaColumn,
} from "utils/questdb"

export enum NotificationType {
  ERROR = "error",
  INFO = "info",
  SUCCESS = "success",
  NOTICE = "notice",
  LOADING = "loading",
}

export type NotificationShape = Readonly<{
  createdAt: Date
  content: ReactNode
  sideContent?: ReactNode
  line2?: ReactNode
  type: NotificationType
  jitCompiled?: boolean
  isMinimized?: boolean
}>

export type RunningShape = Readonly<{
  value: boolean
  isRefresh: boolean
}>

export type QueryStateShape = Readonly<{
  notifications: NotificationShape[]
  tables: Table[]
  columns: InformationSchemaColumn[]
  result?: QueryRawResult
  running: RunningShape
  maxNotifications: number
}>

export enum QueryAT {
  ADD_NOTIFICATION = "QUERY/ADD_NOTIFICATION",
  CLEANUP_NOTIFICATIONS = "QUERY/CLEANUP_NOTIFICATIONS",
  REMOVE_NOTIFICATION = "QUERY/REMOVE_NOTIFICATION",
  SET_RESULT = "QUERY/SET_RESULT",
  STOP_RUNNING = "QUERY/STOP_RUNNING",
  TOGGLE_RUNNING = "QUERY/TOGGLE_RUNNING",
  SET_TABLES = "QUERY/SET_TABLES",
  SET_COLUMNS = "QUERY/SET_COLUMNS",
}

type AddNotificationAction = Readonly<{
  payload: NotificationShape
  type: QueryAT.ADD_NOTIFICATION
}>

type CleanupNotificationsAction = Readonly<{
  type: QueryAT.CLEANUP_NOTIFICATIONS
}>

type RemoveNotificationAction = Readonly<{
  payload: Date
  type: QueryAT.REMOVE_NOTIFICATION
}>

type SetResultAction = Readonly<{
  payload: QueryRawResult
  type: QueryAT.SET_RESULT
}>

type StopRunningAction = Readonly<{
  type: QueryAT.STOP_RUNNING
}>

type ToggleRunningAction = Readonly<{
  type: QueryAT.TOGGLE_RUNNING
  payload: Readonly<{
    isRefresh: boolean
  }>
}>

type SetTablesAction = Readonly<{
  type: QueryAT.SET_TABLES
  payload: Readonly<{
    tables: Table[]
  }>
}>

type SetColumnsActions = Readonly<{
  type: QueryAT.SET_COLUMNS
  payload: Readonly<{
    columns: InformationSchemaColumn[]
  }>
}>

export type QueryAction =
  | AddNotificationAction
  | CleanupNotificationsAction
  | RemoveNotificationAction
  | SetResultAction
  | StopRunningAction
  | ToggleRunningAction
  | SetTablesAction
  | SetColumnsActions
