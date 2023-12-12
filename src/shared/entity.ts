export abstract class Entity<T extends { id: string }> {
  protected _initialProps: T;
  protected _currentProps: T;

  constructor(props: T) {
    this._currentProps = props;
    this._initialProps = { ...props };

    Object.freeze(this._initialProps);
  }

  get props(): T {
    return this._currentProps;
  }

  set props(props: T) {
    this._currentProps = props;
  }

  get initialProps(): T {
    return this._initialProps;
  }

  update(data: Partial<T>) {
    this.props = { ...this.props, ...data };
  }

  commit(): void {
    this._initialProps = { ...this.props };
  }

  public equals(entity?: Entity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }
    if (this === entity) {
      return true;
    }
    return this.props.id === entity.props.id;
  }
}
