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

import React, { ReactNode, Ref } from "react"
import styled, { css } from "styled-components"

import { Text } from "../"
import { color } from "../../utils"

export type TextAlign = "left" | "center" | "right"

type Props = Readonly<{
  arrow?: {
    setArrowElement: Ref<HTMLDivElement>
    styles?: Record<string, string>
  }
  children: ReactNode
  textAlign?: TextAlign
}>

const baseStyles = css`
  position: absolute;
  width: 7px;
  height: 7px;
`

export const TooltipArrow = styled.div`
  ${baseStyles};

  &::before {
    ${baseStyles};
    top: 0;
    left: 0;
    content: "";
    transform: rotate(45deg);
    background: ${color("backgroundDarker")};
    border: 1px solid ${color("gray1")};
    border-radius: 1px;
  }
`

export const Wrapper = styled.div`
  position: relative;
  max-width: 460px;
  padding: 1rem;
  background: ${color("backgroundDarker")};
  border: 1px solid ${color("gray1")};
  border-radius: 1px;

  &[data-popper-placement^="right"] ${TooltipArrow} {
    left: -4px;

    &::before {
      border-right: none;
      border-top: none;
    }
  }

  &[data-popper-placement^="left"] ${TooltipArrow} {
    right: -4px;

    &::before {
      border-left: none;
      border-bottom: none;
    }
  }

  &[data-popper-placement^="top"] ${TooltipArrow} {
    bottom: -4px;

    &::before {
      border-left: none;
      border-top: none;
    }
  }

  &[data-popper-placement^="bottom"] ${TooltipArrow} {
    top: -4px;

    &::before {
      border-right: none;
      border-bottom: none;
    }
  }
`

export const Tooltip = ({
  arrow,
  children,
  textAlign = "left",
  ...rest
}: Props) => (
  <Wrapper {...rest} data-hook="tooltip" style={{ textAlign }}>
    <Text color="foreground">{children}</Text>
    {arrow && <TooltipArrow ref={arrow.setArrowElement} style={arrow.styles} />}
  </Wrapper>
)
