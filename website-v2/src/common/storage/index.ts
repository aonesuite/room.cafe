// localStorage wrapper
// https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage

export class Storage {
  space: string = ""

  constructor(space?: string) {
    if (space) {
      this.space = space
    }
  }

  private key(key: string): string {
    return this.space !== "" ? this.space + ":" + key : key
  }

  set(key: string, value: any) {
    const _value = JSON.stringify(value)
    localStorage.setItem(this.key(key), _value)
  }

  get<T>(key: string): T | null {
    const value = localStorage.getItem(this.key(key))
    if (value === null) {
      return null
    }
    return JSON.parse(value) as T
  }

  remove(key: string) {
    localStorage.removeItem(this.key(key))
  }

  static cleanAll() {
    localStorage.clear()
  }
}

export default new Storage()
