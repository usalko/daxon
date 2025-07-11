import React, { useState } from "react"
import styled from "styled-components"
import { Button } from "@daxon/react-components"
import { FileCopy } from "@styled-icons/remix-line"
import { CheckboxCircle } from "@styled-icons/remix-fill"
import { copyToClipboard } from "../../utils/copyToClipboard"

const StyledButton = styled(Button)`
  padding: 1.2rem 0.6rem;
`

const StyledCheckboxCircle = styled(CheckboxCircle)`
  position: absolute;
  transform: translate(75%, -75%);
  color: ${({ theme }) => theme.color.green};
`

export const CopyButton = ({
  text,
  iconOnly,
}: {
  text: string
  iconOnly?: boolean
}) => {
  const [copied, setCopied] = useState(false)

  return (
    <StyledButton
      skin="secondary"
      data-hook="copy-value"
      onClick={(e) => {
        copyToClipboard(text)
        e.stopPropagation()
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      {...(!iconOnly && { prefixIcon: <FileCopy size="16px" /> })}
    >
      {copied && <StyledCheckboxCircle size="14px" />}
      {iconOnly ? <FileCopy size="16px" /> : "Copy"}
    </StyledButton>
  )
}
