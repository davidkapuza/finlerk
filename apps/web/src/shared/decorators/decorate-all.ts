export function DecorateAll<T>(decorator: MethodDecorator) {
  return (target: { new (): T }) => {
    const descriptors = Object.getOwnPropertyDescriptors(target.prototype);
    for (const [propName, descriptor] of Object.entries(descriptors)) {
      const isMethod =
        typeof descriptor.value == 'function' && propName != 'constructor';
      if (!isMethod) {
        continue;
      }
      decorator(target, propName, descriptor);
      Object.defineProperty(target.prototype, propName, descriptor);
    }
  };
}
