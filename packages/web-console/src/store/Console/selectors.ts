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
import { StoreShape, Sidebar, BottomPanel, TopPanel, ImageToZoom } from "types"

const getSideMenuOpened: (store: StoreShape) => boolean = (store) =>
  store.console.sideMenuOpened

const getActiveTopPanel: (store: StoreShape) => TopPanel = (store) =>
  store.console.activeTopPanel

const getActiveSidebar: (store: StoreShape) => Sidebar = (store) =>
  store.console.activeSidebar

const getActiveBottomPanel: (store: StoreShape) => BottomPanel = (store) =>
  store.console.activeBottomPanel

const getImageToZoom: (store: StoreShape) => ImageToZoom | undefined = (
  store,
) => store.console.imageToZoom

export default {
  getSideMenuOpened,
  getActiveTopPanel,
  getActiveSidebar,
  getActiveBottomPanel,
  getImageToZoom,
}
