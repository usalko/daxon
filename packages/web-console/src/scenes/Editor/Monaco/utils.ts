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
import { editor, IPosition, IRange } from "monaco-editor"
import { Monaco } from "@monaco-editor/react"

type IStandaloneCodeEditor = editor.IStandaloneCodeEditor

export const PostgresDBLanguageName: string = "questdb-sql"

export type Request = Readonly<{
  query: string
  row: number
  column: number
}>

export const stripSQLComments = (text: string): string =>
  text.replace(/(?<!["'`])(--\s?.*$)/gm, (match, group) => {
    if (group) {
      const groupLines = group.split("\n")
      if (group.startsWith("--") && groupLines.length > 1) {
        return "\n" + stripSQLComments(groupLines[1])
      }
      return ""
    }
    return match
  })

export const getSelectedText = (
  editor: IStandaloneCodeEditor,
): string | undefined => {
  const model = editor.getModel()
  const selection = editor.getSelection()
  return model && selection ? model.getValueInRange(selection) : undefined
}

export const getQueryFromCursor = (
  editor: IStandaloneCodeEditor,
): Request | undefined => {
  const text = stripSQLComments(
    editor.getValue({ preserveBOM: false, lineEnding: "\n" }),
  )
  const position = editor.getPosition()

  let row = 0

  let column = 0

  const sqlTextStack = []
  let startRow = 0
  let startCol = 0
  let startPos = -1
  let nextSql = null
  let inQuote = false

  if (!position) return

  let i = 0;

  for (; i < text.length; i++) {
    if (nextSql !== null) {
      break
    }

    const char = text[i]

    switch (char) {
      case ";": {
        if (inQuote) {
          column++
          continue
        }

        if (
          row < position.lineNumber - 1 ||
          (row === position.lineNumber - 1 && column < position.column - 1)
        ) {
          sqlTextStack.push({
            row: startRow,
            col: startCol,
            position: startPos,
            endRow: row,
            endCol: column,
            limit: i,
          })
          startRow = row
          startCol = column
          startPos = i + 1
          column++
        } else {
          // empty queries, aka ;; , make sql.length === 0
          nextSql = {
            row: startRow,
            col: startCol,
            position: startPos,
            endRow: row,
            endCol: column,
            limit: i,
          }
        }
        break
      }

      case " ": {
        // ignore leading space
        if (startPos === i) {
          startRow = row
          startCol = column
          startPos = i + 1
        }

        column++
        break
      }

      case "\n": {
        row++
        column = 0

        if (startPos === i) {
          startRow = row
          startCol = column
          startPos = i + 1
        }
        break
      }

      case "'": {
        inQuote = !inQuote
        column++
        break
      }

      default: {
        column++
        break
      }
    }
  }

  // lastStackItem is the last query that is completed before the current cursor position.
  // nextSql is the next query that is not completed before the current cursor position, or started after the current cursor position.
  const normalizedCurrentRow = position.lineNumber - 1
  const lastStackItem = sqlTextStack.length > 0 ? sqlTextStack[sqlTextStack.length - 1] : null

  if (!nextSql) {
    const sqlText = startPos === - 1 ? text : text.substring(startPos)
    if (sqlText.length > 0) {
      nextSql = {
        row: startRow,
        col: startCol,
        position: startPos === -1 ? 0 : startPos,
        endRow: row,
        endCol: column,
        limit: i,
      }
    }
  }

  const lastStackItemRowRange = lastStackItem ? {
    start: lastStackItem.row,
    end: lastStackItem.endRow,
  } : null
  const nextSqlRowRange = nextSql ? {
    start: nextSql.row,
    end: nextSql.endRow,
  } : null
  const isInLastStackItemRowRange = lastStackItemRowRange && normalizedCurrentRow >= lastStackItemRowRange.start && normalizedCurrentRow <= lastStackItemRowRange.end
  const isInNextSqlRowRange = nextSqlRowRange && normalizedCurrentRow >= nextSqlRowRange.start && normalizedCurrentRow <= nextSqlRowRange.end

  if (isInLastStackItemRowRange && !isInNextSqlRowRange) {
    return {
      query: text.substring(lastStackItem!.position, lastStackItem!.limit),
      row: lastStackItem!.row,
      column: lastStackItem!.col,
    }
  } else if (isInNextSqlRowRange && !isInLastStackItemRowRange) {
    return {
      query: text.substring(nextSql!.position, nextSql!.limit),
      row: nextSql!.row,
      column: nextSql!.col,
    }
  } else if (isInLastStackItemRowRange && isInNextSqlRowRange) {
    const lastStackItemEndCol = lastStackItem!.endCol
    const normalizedCurrentCol = position.column - 1
    if (normalizedCurrentCol > lastStackItemEndCol + 1) {
      return {
        query: text.substring(nextSql!.position, nextSql!.limit),
        row: nextSql!.row,
        column: nextSql!.col,
      }
    }
    return {
      query: text.substring(lastStackItem!.position, lastStackItem!.limit),
      row: lastStackItem!.row,
      column: lastStackItem!.col,
    }
  }
}

export const getQueryFromSelection = (
  editor: IStandaloneCodeEditor,
): Request | undefined => {
  const selection = editor.getSelection()
  const selectedText = getSelectedText(editor)
  if (selection && selectedText) {
    let n = selectedText.length
    let column = selectedText.charAt(n)

    while (n > 0 && (column === " " || column === "\n" || column === ";")) {
      n--
      column = selectedText.charAt(n)
    }

    if (n > 0) {
      return {
        query: selectedText.substr(0, n + 1),
        row: selection.startLineNumber - 1,
        column: selection.startColumn,
      }
    }
  }
}

export const getQueryRequestFromEditor = (
  editor: IStandaloneCodeEditor,
): Request | undefined => {
  const selectedText = getSelectedText(editor)
  if (selectedText) {
    return getQueryFromSelection(editor)
  }
  return getQueryFromCursor(editor)
}

export const getQueryRequestFromLastExecutedQuery = (
  query: string,
): Request | undefined => {
  return {
    query,
    row: 0,
    column: 0,
  }
}

export const getErrorRange = (
  editor: IStandaloneCodeEditor,
  request: Request,
  errorPosition: number,
): IRange | null => {
  const isErrorAtEnd = errorPosition === request.query.length
  if (isErrorAtEnd) {
    const lastPosition = request.query.trimEnd().length
    const position = toTextPosition(request, lastPosition)
    return {
      startColumn: position.column,
      endColumn: position.column,
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
    }
  }
  const position = toTextPosition(request, errorPosition)
  const model = editor.getModel()
  if (model) {
    const selection = editor.getSelection()
    const selectedText = getSelectedText(editor)
    let wordAtPosition
    if (selection && selectedText) {
      wordAtPosition = model.getWordAtPosition({
        column: selection.startColumn + position.column,
        lineNumber: position.lineNumber,
      })
    } else {
      wordAtPosition = model.getWordAtPosition(position)
    }
    if (wordAtPosition) {
      return {
        startColumn: wordAtPosition.startColumn,
        endColumn: wordAtPosition.endColumn,
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
      }
    }
  }
  return null
}

export const insertTextAtCursor = (
  editor: IStandaloneCodeEditor,
  text: string,
) => {
  editor.trigger("keyboard", "type", { text })
  editor.focus()
}

const insertText = ({
  editor,
  lineNumber,
  column,
  text,
}: {
  editor: IStandaloneCodeEditor
  lineNumber: number
  column: number
  text: string
}) => {
  editor.executeEdits("", [
    {
      range: {
        startLineNumber: lineNumber,
        startColumn: column,
        endLineNumber: lineNumber,
        endColumn: column,
      },
      text,
    },
  ])
}

/** `getTextFixes` is used to create correct prefix and suffix for the text that is inserted in the editor.
 * When inserting text, we want it to be neatly aligned with surrounding empty lines.
 * For example, appending text at the last line should add one new line, whereas in other cases it should add two.
 * This function defines these rules.
 */
const getTextFixes = ({
  appendAt,
  model,
  position,
}: {
  appendAt: AppendQueryOptions["appendAt"]
  model: ReturnType<typeof editor.getModel>
  position: IPosition
}): {
  prefix: number
  suffix: number
  lineStartOffset: number
  selectStartOffset: number
} => {
  const isFirstLine = position.lineNumber === 1
  const isLastLine =
    position.lineNumber === model?.getValue().split("\n").length
  const lineAtCursor = model?.getLineContent(position.lineNumber)
  const nextLine = isLastLine
    ? undefined
    : model?.getLineContent(position.lineNumber + 1)
  const inMiddle = !isFirstLine && !isLastLine

  type Rule = {
    when: () => boolean
    then: () => {
      prefix?: number
      suffix?: number
      lineStartOffset?: number
      selectStartOffset?: number
    }
  }

  const defaultResult = {
    prefix: 1,
    suffix: 2,
    lineStartOffset: 1,
    selectStartOffset: 0,
  }

  const rules: { [key in AppendQueryOptions["appendAt"]]: Rule[] } = {
    end: [
      {
        when: () => isFirstLine,
        then: () => ({ prefix: 1, suffix: 0 }),
      },

      {
        // default case
        when: () => true,
        then: () => ({ prefix: 2, suffix: 0, selectStartOffset: 1 }),
      },
    ],

    cursor: [
      {
        when: () => model?.getValue() === "",
        then: () => ({ prefix: 0, suffix: 1, lineStartOffset: 0 }),
      },

      {
        when: () => isFirstLine && lineAtCursor === "",
        then: () => ({
          prefix: 0,
          lineStartOffset: 0,
          suffix: nextLine === "" ? 0 : 1,
        }),
      },

      {
        when: () => isFirstLine && lineAtCursor !== "",
        then: () => ({
          prefix: nextLine === "" ? 1 : 2,
          suffix: 1,
          selectStartOffset: 1,
        }),
      },

      {
        when: () => inMiddle && lineAtCursor === "",
        then: () => ({
          prefix: 0,
          suffix: nextLine === "" ? 1 : 2,
        }),
      },

      {
        when: () => inMiddle && lineAtCursor !== "" && nextLine !== "",
        then: () => ({ prefix: 1, suffix: 2 }),
      },

      {
        when: () => inMiddle && lineAtCursor !== "" && nextLine === "",
        then: () => ({ prefix: 1, suffix: 1, selectStartOffset: 1 }),
      },

      {
        when: () => isLastLine,
        then: () => ({
          prefix: lineAtCursor === "" ? 1 : 2,
          suffix: 1,
          lineStartOffset: 1,
          selectStartOffset: lineAtCursor === "" ? 0 : 1,
        }),
      },
    ],
  }

  const result = (
    rules[appendAt].find(({ when }) => when()) ?? { then: () => defaultResult }
  ).then()

  return {
    ...defaultResult,
    ...result,
  }
}

const getInsertPosition = ({
  model,
  position,
  lineStartOffset,
  newQueryLines,
  appendAt,
}: {
  model: ReturnType<typeof editor.getModel>
  position: IPosition
  lineStartOffset: number
  appendAt: AppendQueryOptions["appendAt"]
  newQueryLines: string[]
}): {
  lineStart: number
  lineEnd: number
  columnStart: number
  columnEnd: number
} => {
  if (appendAt === "cursor") {
    return {
      lineStart: position.lineNumber + lineStartOffset,
      lineEnd: position.lineNumber + newQueryLines.length,
      columnStart: 0,
      columnEnd: newQueryLines[newQueryLines.length - 1].length + 1,
    }
  }

  const lineStart =
    (model?.getValue().split("\n").length ?? 0) + lineStartOffset
  return {
    lineStart,
    lineEnd: lineStart + newQueryLines.length,
    columnStart: 0,
    columnEnd: newQueryLines[newQueryLines.length - 1].length + 1,
  }
}

export type AppendQueryOptions = {
  appendAt: "cursor" | "end"
}

export const appendQuery = (
  editor: IStandaloneCodeEditor,
  query: string,
  options: AppendQueryOptions = { appendAt: "cursor" },
) => {
  const model = editor.getModel()

  if (model) {
    const position = editor.getPosition()

    if (position) {
      const newQueryLines = query.split("\n")

      const { prefix, suffix, lineStartOffset, selectStartOffset } =
        getTextFixes({
          appendAt: options.appendAt,
          model,
          position,
        })

      const positionInsert = getInsertPosition({
        model,
        position,
        lineStartOffset,
        appendAt: options.appendAt,
        newQueryLines,
      })

      const positionSelect = {
        lineStart: positionInsert.lineStart + selectStartOffset,
        lineEnd:
          positionInsert.lineStart +
          selectStartOffset +
          (newQueryLines.length - 1),
        columnStart: 0,
        columnEnd: positionInsert.columnEnd,
      }

      insertText({
        editor,
        lineNumber: positionInsert.lineStart,
        column: positionInsert.columnStart,
        text: `${"\n".repeat(prefix)}${query}${"\n".repeat(suffix)}`,
      })

      editor.setSelection({
        startLineNumber: positionSelect.lineStart,
        endLineNumber: positionSelect.lineEnd,
        startColumn: positionSelect.columnStart,
        endColumn: positionSelect.columnEnd,
      })
    }

    editor.focus()

    if (options.appendAt === "end") {
      editor.revealLine(model.getLineCount())
    }
  }
}

export const clearModelMarkers = (
  monaco: Monaco,
  editor: IStandaloneCodeEditor,
) => {
  const model = editor.getModel()

  if (model) {
    monaco.editor.setModelMarkers(model, PostgresDBLanguageName, [])
  }
}

export const setErrorMarker = (
  monaco: Monaco,
  editor: IStandaloneCodeEditor,
  errorRange: IRange,
  message: string,
) => {
  const model = editor.getModel()

  if (model) {
    monaco.editor.setModelMarkers(model, PostgresDBLanguageName, [
      {
        message,
        severity: monaco.MarkerSeverity.Error,
        startLineNumber: errorRange.startLineNumber,
        endLineNumber: errorRange.endLineNumber,
        startColumn: errorRange.startColumn,
        endColumn: errorRange.endColumn,
      },
    ])
  }
}

export const toTextPosition = (
  request: Request,
  position: number,
): IPosition => {
  const end = Math.min(position, request.query.length)
  let row = 0
  let column = 0

  for (let i = 0; i < end; i++) {
    if (request.query.charAt(i) === "\n") {
      row++
      column = 0
    } else {
      column++
    }
  }

  return {
    lineNumber: row + 1 + request.row,
    column: (row === 0 ? column + request.column : column) + 1,
  }
}

export const findMatches = (model: editor.ITextModel, needle: string) =>
  model.findMatches(
    needle /* searchString */,
    true /* searchOnlyEditableRange */,
    false /* isRegex */,
    true /* matchCase */,
    null /* wordSeparators */,
    true /* captureMatches */,
  ) ?? null
