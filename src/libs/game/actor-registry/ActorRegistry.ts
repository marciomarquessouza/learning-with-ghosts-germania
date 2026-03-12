export class ActorRegistry<T extends Record<string, unknown>> {
  private actors = new Map<keyof T, T[keyof T]>();

  register<K extends keyof T>(name: K, actor: T[K] ) {
    this.actors.set(name, actor)
  }

  get<K extends keyof T>(name: K): T[K] | null {
    if (!this.actors.has(name)) return null

    return this.actors.get(name) as T[K]
  }

  remove<K extends keyof T>(name: K) {
    this.actors.delete(name)
  }

  removeAll() {
    this.actors.clear()
  }
}
