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

import React, { useCallback, useEffect, useState } from "react"
import { CSSTransition } from "react-transition-group"
import styled, { createGlobalStyle } from "styled-components"
import { Github } from "@styled-icons/remix-fill"

import { Link, Text, TransitionDuration } from "../../components"

import GithubBanner from "./GithubBanner"
import BuildVersion from "./BuildVersion"
import ConnectionStatus from "./ConnectionStatus"
import { eventBus } from "../../modules/EventBus"
import { EventType } from "../../modules/EventBus/types"
import { useSettings } from "../../providers"

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  height: 4rem;
  bottom: 0;
  left: 0;
  right: 0;
  padding-left: 45px;
`

const LeftContainer = styled.div`
  display: flex;
  padding-left: 1rem;
  align-items: center;
  flex: 1;
`

const RightContainer = styled.div`
  display: flex;
  padding-right: 1rem;
  align-items: center;

  & > *:not(:last-child) {
    margin-right: 1rem;
  }
`

const GithubBannerTransition = createGlobalStyle`
  .github-banner-enter {
    max-height: 0;
  }

  .github-banner-enter-active {
    max-height: 4rem;
    transition: all ${TransitionDuration.REG}ms;
  }

  .github-banner-exit,
  .github-banner-enter-done {
    max-height: 4rem;
  }

  .github-banner-exit-active {
    max-height: 0;
    transition: all ${TransitionDuration.REG}ms;
  }
`

const Footer = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [showBuildVersion, setShowBuildVersion] = useState(true)
  const handleClick = useCallback(() => {
    setShowBanner(false)
  }, [])
  const { consoleConfig } = useSettings()

  useEffect(() => {
    setTimeout(() => {
      setShowBanner(true)
    }, 2e3)

    eventBus.subscribe(EventType.MSG_CONNECTION_ERROR, () => {
      setShowBuildVersion(false)
    })

    eventBus.subscribe(EventType.MSG_CONNECTION_OK, () => {
      setShowBuildVersion(true)
    })
  }, [])

  return (
    <Wrapper id="footer">
      <LeftContainer>
        <Text color="foreground">
          Copyright &copy; {new Date().getFullYear()} PostgresDB
        </Text>
      </LeftContainer>
      <RightContainer>
        <ConnectionStatus />
        {showBuildVersion && <BuildVersion />}
        <Link
          color="foreground"
          hoverColor="cyan"
          href="https://github.com/questdb/questdb"
          rel="noreferrer"
          target="_blank"
        >
          <Github size="18px" />
        </Link>
      </RightContainer>

      <GithubBannerTransition />
      <CSSTransition
        classNames="github-banner"
        in={showBanner && consoleConfig.githubBanner}
        timeout={TransitionDuration.REG}
        unmountOnExit
      >
        <GithubBanner onClick={handleClick} />
      </CSSTransition>
    </Wrapper>
  )
}

export default Footer
