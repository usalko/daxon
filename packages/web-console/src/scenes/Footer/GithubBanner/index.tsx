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
import React from "react"
import styled from "styled-components"
import { Close, Star } from "@styled-icons/remix-line"

import { Link } from "../../../components"
import { color } from "../../../utils"

type Props = Readonly<{
  onClick: () => void
}>

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: ${color("pink")};
  overflow: hidden;
`

const GithubLink = styled.span`
  text-decoration: underline;
`

const CloseIcon = styled(Close)`
  position: absolute;
  right: 1rem;
  color: ${color("black")};

  &:hover {
    cursor: pointer;
  }
`

const StarIcon = styled(Star)`
  color: ${color("yellow")};
`

const GithubBanner = ({ onClick }: Props) => (
  <Wrapper>
    <Link
      hoverColor="black"
      href="https://github.com/questdb/questdb"
      weight={800}
    >
      If you like PostgresDB, give us a <StarIcon size="14px" />
      &nbsp;on&nbsp;
      <GithubLink>Github</GithubLink>
    </Link>
    <CloseIcon onClick={onClick} size="20px" />
  </Wrapper>
)

export default GithubBanner
