import * as PostgresDB from "./questdb"

export const errorWorkarounds: Record<
  PostgresDB.ErrorTag,
  {
    title: string
    message: string
    link: string
  }
> = {
  [PostgresDB.ErrorTag.TOO_MANY_OPEN_FILES]: {
    title: "System limit for open files",
    message:
      "Too many open files, please, increase the maximum number of open file handlers OS limit",
    link: "https://questdb.io/docs/deployment/capacity-planning/#maximum-open-files",
  },
  [PostgresDB.ErrorTag.DISK_FULL]: {
    title: "OS configuration",
    message:
      "No space left on device, please, extend the volume or free existing disk space up",
    link: "https://questdb.io/docs/deployment/capacity-planning/#os-configuration",
  },
  [PostgresDB.ErrorTag.OUT_OF_MMAP_AREAS]: {
    title: "Max virtual memory areas limit",
    message:
      "Out of virtual memory mapping areas, please, increase the maximum number of memory-mapped areas OS limit",
    link: "https://questdb.io/docs/deployment/capacity-planning/#max-virtual-memory-areas-limit",
  },
  [PostgresDB.ErrorTag.OUT_OF_MEMORY]: {
    title: "Out of memory",
    message:
      "Out of memory, please, analyze system metrics, and upgrade memory, if necessary",
    link: "https://questdb.io/docs/deployment/capacity-planning/#cpu-and-ram-configuration",
  },
  [PostgresDB.ErrorTag.UNSUPPORTED_FILE_SYSTEM]: {
    title: "Unsupported file system",
    message:
      "DB root is located on an unsupported file system, please, move the DB root to a volume with supported file system",
    link: "https://questdb.io/docs/operations/backup/#supported-filesystems",
  },
}
