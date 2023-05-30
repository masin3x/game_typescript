export class Container {
  private static readonly map = new Map<any, any>([]);
  private static readonly instancesCache = new Map<any, any>();

  private static cache(type: any, instance: any) {
    Container.instancesCache.set(type, instance);
  }

  private static create = (type: any, ...args: any[]): any => {
    return new type(...args);
  };

  static resolve(type: any, ...args: any[]): any {
    let instance = Container.instancesCache.get(type);

    if (instance) {
      return instance;
    }

    const dependencyType = Container.map.get(type);

    instance = dependencyType ? Container.create(dependencyType, ...args) : Container.create(type, ...args);

    Container.cache(type, instance);

    return instance;
  }
}
