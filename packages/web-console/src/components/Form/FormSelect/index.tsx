import React from "react"
import { useFormContext } from "react-hook-form"
import { Select } from "@daxon/react-components"
import type { Props } from "@daxon/react-components/dist/components/Select"

export const FormSelect = ({ name, ...rest }: Props) => {
  const { register } = useFormContext()
  return <Select {...register(name)} {...rest} />
}
