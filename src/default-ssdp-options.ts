
import { v4 } from 'uuid'
import { defaultSocketOptions } from './default-socket-options.js'
import util from 'util'
import mergeOptions from 'merge-options'
import type { SSDPOptions } from './index.js'

const DEFAULT_SSDP_SIGNATURE = util.format('node.js/%s UPnP/1.1 %s/%s', process.version.substring(1), "@achingbrain/ssdp", "4.0.1")

export function defaultSsdpOptions (options?: Partial<SSDPOptions>): SSDPOptions {
  return mergeOptions(options ?? {}, {
    usn: `uuid:${v4()}`, // eslint-disable-line @typescript-eslint/restrict-template-expressions
    signature: DEFAULT_SSDP_SIGNATURE,
    sockets: [{}].map(defaultSocketOptions),
    retry: {
      times: 5,
      interval: 5000
    }
  })
}
