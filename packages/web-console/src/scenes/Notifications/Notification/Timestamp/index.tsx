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

import React, { useMemo } from "react"
import styled from "styled-components"
import { Text } from "../../../../components"
import { format } from "date-fns"
import { fetchUserLocale, getLocaleFromLanguage } from "../../../../utils"

type Props = {
  createdAt: Date
}

const TimestampText = styled(Text)`
  display: flex;
  margin-right: 0.5rem;
  white-space: nowrap;
`

export const Timestamp = ({ createdAt }: Props) => {
  const userLocale = useMemo(fetchUserLocale, [])

  return (
    <TimestampText color="gray2">
      [
      {format(createdAt, "pppp", { locale: getLocaleFromLanguage(userLocale) })}
      ]
    </TimestampText>
  )
}
