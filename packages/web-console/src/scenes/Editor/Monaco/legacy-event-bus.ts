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
import { appendQuery, AppendQueryOptions } from "./utils"
import { eventBus } from "../../../modules/EventBus"
import { EventType } from "../../../modules/EventBus/types"
import type { editor } from "monaco-editor"

export const registerLegacyEventBusEvents = ({
  editor,
  insertTextAtCursor,
  toggleRunning,
}: {
  editor: editor.IStandaloneCodeEditor
  insertTextAtCursor: (text: string) => void
  toggleRunning: (isRefresh?: boolean) => void
}) => {
  eventBus.subscribe<string>(EventType.MSG_EDITOR_INSERT_COLUMN, (column) => {
    if (column) {
      insertTextAtCursor(column)
    }
  })

  eventBus.subscribe<{ query: string; options?: AppendQueryOptions }>(
    EventType.MSG_QUERY_FIND_N_EXEC,
    (payload) => {
      if (payload) {
        const text = `${payload.query};`
        appendQuery(editor, text, payload.options)
        toggleRunning()
      }
    },
  )

  eventBus.subscribe(EventType.MSG_QUERY_EXEC, () => {
    toggleRunning(true)
  })

  eventBus.subscribe(EventType.MSG_EDITOR_FOCUS, () => {
    const position = editor.getPosition()
    if (position) {
      editor.setPosition({
        lineNumber: position.lineNumber + 1,
        column: position?.column,
      })
    }
    editor.focus()
  })
}
