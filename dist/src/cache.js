class Cache {
    constructor() {
        this.services = new Map();
    }
    hasService(serviceType, uniqueServiceName) {
        const instances = this.services.get(serviceType);
        if (instances == null) {
            return false;
        }
        return instances.has(uniqueServiceName);
    }
    getService(serviceType, uniqueServiceName) {
        const instances = this.services.get(serviceType);
        if (instances == null) {
            return undefined;
        }
        const service = instances.get(uniqueServiceName);
        if (service == null) {
            return;
        }
        return service;
    }
    deleteService(serviceType, uniqueServiceName) {
        const instances = this.services.get(serviceType);
        if (instances == null) {
            return;
        }
        instances.delete(uniqueServiceName);
        if (instances.size === 0) {
            this.services.delete(serviceType);
        }
    }
    cacheService(service) {
        const instances = this.services.get(service.serviceType) ?? new Map();
        instances.set(service.uniqueServiceName, service);
        this.services.set(service.serviceType, instances);
    }
    clear() {
        this.services = new Map();
    }
}
export const cache = new Cache();
//# sourceMappingURL=cache.js.map