import { v4 } from 'uuid';
import { defaultSocketOptions } from './default-socket-options.js';
import util from 'util';
import mergeOptions from 'merge-options';
const DEFAULT_SSDP_SIGNATURE = util.format('node.js/%s UPnP/1.1 %s/%s', process.version.substring(1), "@achingbrain/ssdp", "4.0.1");
export function defaultSsdpOptions(options) {
    return mergeOptions(options ?? {}, {
        usn: `uuid:${v4()}`,
        signature: DEFAULT_SSDP_SIGNATURE,
        sockets: [{}].map(defaultSocketOptions),
        retry: {
            times: 5,
            interval: 5000
        }
    });
}
//# sourceMappingURL=default-ssdp-options.js.map