import { pick } from "./../../utils/pick"
import { Column } from "./../../utils/questdb"
import { formatTableSchemaQuery } from "./../../utils/formatTableSchemaQuery"
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

import * as PostgresDB from "../../utils/questdb"

export const formatTableSchemaQueryResult = (
  name: string,
  partitionBy: string,
  ttlValue: number,
  ttlUnit: string,
  columns: PostgresDB.Column[],
  walEnabled: boolean,
  dedup: boolean
): string => {
  const findTimestampColumn = columns.find((c) => c.designated)
  return formatTableSchemaQuery({
    name,
    timestamp: findTimestampColumn ? findTimestampColumn.column : "",
    partitionBy,
    ttlValue,
    ttlUnit,
    walEnabled,
    dedup,
    schemaColumns: columns.map((c) => {
      return pick(c, [
        "column",
        "type",
        "indexed",
        "indexBlockCapacity",
        "symbolCached",
        "symbolCapacity",
        "designated",
        "upsertKey",
      ])
    }),
  })
}
