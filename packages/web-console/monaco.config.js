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

const path = require("path")
const pnp = require("pnpapi")
const monacoPath = pnp.resolveToUnqualified("monaco-editor", __filename)
const getPath = (...p) => path.join(monacoPath, ...p)

module.exports = {
  assetCopyPatterns: [
    {
      from: getPath("min", "vs", "loader.js"),
      to: "assets/vs/loader.js",
    },
    {
      from: getPath("min", "vs", "editor", "editor.main.js"),
      to: "assets/vs/editor/editor.main.js",
    },
    {
      from: getPath("min", "vs", "editor", "editor.main.nls.js"),
      to: "assets/vs/editor/editor.main.nls.js",
    },
    {
      from: getPath("min", "vs", "editor", "editor.main.css"),
      to: "assets/vs/editor/editor.main.css",
    },
    {
      from: getPath("min", "vs", "base"),
      to: "assets/vs/base",
    },
  ],

  sourceMapCopyPatterns: [
    {
      from: getPath("min-maps", "vs", ""),
      to: "min-maps/vs",
    },
  ],
}
