export interface IPostgresDBGrid {
  focus(): void

  show(): void

  hide(): void

  render(): void

  addEventListener(eventName: string, fn: (event: CustomEvent) => void)

  setData(data: any): void

  getSQL(): string

  clearCustomLayout(): void

  toggleFreezeLeft(): void

  shuffleFocusedColumnToFront(): void

  getResultAsMarkdown(): string
}

export function grid(
  root: HTMLElement | null,
  paginationFn?: (
    sql: string,
    lo: number,
    hi: number,
    rendererFn: (data: any) => void,
  ) => void,
  id?: string,
): IPostgresDBGrid
