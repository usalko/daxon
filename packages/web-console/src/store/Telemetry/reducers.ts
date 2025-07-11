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

import { TelemetryAction, TelemetryAT, TelemetryStateShape } from "../../types"

const yearOffset = 24 * 60 * 60 * 1000 * 31 * 12

export const initialState: TelemetryStateShape = {}

const telemetry = (
  state = initialState,
  action: TelemetryAction,
): TelemetryStateShape => {
  switch (action.type) {
    case TelemetryAT.SET_CONFIG: {
      return {
        ...state,
        config: action.payload,
      }
    }

    case TelemetryAT.SET_REMOTE_CONFIG: {
      return {
        ...state,
        remoteConfig: {
          cta: false,
          lastUpdated: new Date(
            new Date().getTime() - yearOffset,
          ).toISOString(),
          ...action.payload,
        },
      }
    }

    default:
      return state
  }
}

export default telemetry
