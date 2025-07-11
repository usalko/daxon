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

import {
  NotificationShape,
  NotificationType,
  QueryAction,
  QueryAT,
} from "../../types"

const setTables = (payload: Table[]): QueryAction => ({
  payload: {
    tables: payload,
  },
  type: QueryAT.SET_TABLES,
})

const setColumns = (payload: InformationSchemaColumn[]): QueryAction => ({
  payload: {
    columns: payload,
  },
  type: QueryAT.SET_COLUMNS,
})

const addNotification = (
  payload: Partial<NotificationShape> & { content: ReactNode },
): QueryAction => ({
  payload: {
    createdAt: new Date(),
    type: NotificationType.SUCCESS,
    ...payload,
  },
  type: QueryAT.ADD_NOTIFICATION,
})

const cleanupNotifications = (): QueryAction => ({
  type: QueryAT.CLEANUP_NOTIFICATIONS,
})

const removeNotification = (payload: Date): QueryAction => ({
  payload,
  type: QueryAT.REMOVE_NOTIFICATION,
})

const setResult = (payload: QueryRawResult): QueryAction => ({
  payload,
  type: QueryAT.SET_RESULT,
})

const stopRunning = (): QueryAction => ({
  type: QueryAT.STOP_RUNNING,
})

const toggleRunning = (isRefresh = false): QueryAction => ({
  type: QueryAT.TOGGLE_RUNNING,
  payload: {
    isRefresh,
  },
})

export default {
  addNotification,
  cleanupNotifications,
  removeNotification,
  setResult,
  stopRunning,
  toggleRunning,
  setTables,
  setColumns,
}
