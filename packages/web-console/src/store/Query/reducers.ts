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

import { QueryAction, QueryAT, QueryStateShape } from "../../types"

export const initialState: QueryStateShape = {
  notifications: [],
  tables: [],
  columns: [],
  running: {
    value: false,
    isRefresh: false,
  },
  maxNotifications: 20,
}

const query = (state = initialState, action: QueryAction): QueryStateShape => {
  switch (action.type) {
    case QueryAT.ADD_NOTIFICATION: {
      const notifications = [...state.notifications, action.payload]

      while (notifications.length === state.maxNotifications) {
        notifications.shift()
      }

      return {
        ...state,
        notifications,
      }
    }

    case QueryAT.CLEANUP_NOTIFICATIONS: {
      return {
        ...state,
        notifications: [],
      }
    }

    case QueryAT.REMOVE_NOTIFICATION: {
      return {
        ...state,
        notifications: state.notifications.filter(
          ({ createdAt }) => createdAt !== action.payload,
        ),
      }
    }

    case QueryAT.SET_RESULT: {
      return {
        ...state,
        result: action.payload,
      }
    }

    case QueryAT.STOP_RUNNING: {
      return {
        ...state,
        running: {
          value: false,
          isRefresh: false,
        },
      }
    }

    case QueryAT.TOGGLE_RUNNING: {
      return {
        ...state,
        running: {
          value: !state.running.value,
          isRefresh: action.payload.isRefresh,
        },
      }
    }

    case QueryAT.SET_TABLES: {
      return {
        ...state,
        tables: action.payload.tables,
      }
    }

    case QueryAT.SET_COLUMNS: {
      return {
        ...state,
        columns: action.payload.columns,
      }
    }

    default:
      return state
  }
}

export default query
