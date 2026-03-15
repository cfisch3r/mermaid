// Context Map Types
// Value objects and type definitions

export class BoundedContext {
  private static readonly VALID_NAME_PATTERN = /^[A-Za-z]\w*$/;

  public readonly id: string;
  public readonly name: string;

  private constructor(name: string) {
    this.name = name;
    this.id = name.toLowerCase();
  }

  static create(name: string): BoundedContext {
    this.validateNotEmpty(name);
    this.validateFormat(name);
    return new BoundedContext(name);
  }

  private static validateNotEmpty(name: string): void {
    if (name.trim().length === 0) {
      throw new Error('Context name cannot be empty');
    }
  }

  private static validateFormat(name: string): void {
    if (!this.VALID_NAME_PATTERN.test(name)) {
      throw new Error(
        'Context name must start with a letter and contain only letters, numbers, and underscores'
      );
    }
  }

  equals(other: BoundedContext): boolean {
    return this.id === other.id;
  }
}

export class Partnership {
  private constructor(
    public readonly one: BoundedContext,
    public readonly other: BoundedContext
  ) {}

  static create(one: BoundedContext, other: BoundedContext): Partnership {
    if (one.equals(other)) {
      throw new Error('Self-referencing relationships are not allowed');
    }
    return new Partnership(one, other);
  }

  participants(): [BoundedContext, BoundedContext] {
    return [this.one, this.other];
  }

  key(): string {
    const [a, b] = [this.one.id, this.other.id].sort();
    return `partnership:${a}:${b}`;
  }

  pairKey(): string {
    const [a, b] = [this.one.id, this.other.id].sort();
    return `${a}:${b}`;
  }
}

export class UpstreamDownstream {
  private constructor(
    public readonly from: BoundedContext,
    public readonly to: BoundedContext
  ) {}

  static create(from: BoundedContext, to: BoundedContext): UpstreamDownstream {
    if (from.equals(to)) {
      throw new Error('Self-referencing relationships are not allowed');
    }
    return new UpstreamDownstream(from, to);
  }

  participants(): [BoundedContext, BoundedContext] {
    return [this.from, this.to];
  }

  key(): string {
    return `upstream-downstream:${this.from.id}:${this.to.id}`;
  }

  pairKey(): string {
    const [a, b] = [this.from.id, this.to.id].sort();
    return `${a}:${b}`;
  }
}

export type Relationship = Partnership | UpstreamDownstream;
