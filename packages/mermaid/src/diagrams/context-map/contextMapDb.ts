// Context Map Database

import type { BoundedContext, Relationship } from './contextMapTypes.js';

export class ContextMapDB {
  private contexts = new Map<string, BoundedContext>();
  private relationships = new Map<string, Relationship>();

  public clear(): void {
    this.contexts.clear();
    this.relationships.clear();
  }

  public addContext(context: BoundedContext): void {
    if (this.contexts.has(context.id)) {
      throw new Error(`Context '${context.name}' already exists`);
    }
    this.contexts.set(context.id, context);
  }

  public getContexts(): BoundedContext[] {
    return [...this.contexts.values()];
  }

  public addRelationship(relationship: Relationship): void {
    const [one, other] = relationship.participants();
    if (!this.contexts.has(one.id)) {
      throw new Error(`Context '${one.name}' not found`);
    }
    if (!this.contexts.has(other.id)) {
      throw new Error(`Context '${other.name}' not found`);
    }
    if (this.relationships.has(relationship.key())) {
      throw new Error(`Relationship between '${one.name}' and '${other.name}' already exists`);
    }
    const conflicting = [...this.relationships.values()].find(
      (r) => r.pairKey() === relationship.pairKey()
    );
    if (conflicting) {
      throw new Error(`Conflicting relationship types between '${one.name}' and '${other.name}'`);
    }
    this.relationships.set(relationship.key(), relationship);
  }

  public getRelationships(): Relationship[] {
    return [...this.relationships.values()];
  }
}

export const db = new ContextMapDB();
