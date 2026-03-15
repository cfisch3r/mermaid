// Context Map Types Tests

import { describe, it, expect } from 'vitest';
import { BoundedContext, Partnership, UpstreamDownstream } from './contextMapTypes.js';

describe('BoundedContext', () => {
  describe('create', () => {
    it('should create a bounded context with preserved name and normalized id', () => {
      const context = BoundedContext.create('Sales_Platform');
      expect(context).toEqual({ id: 'sales_platform', name: 'Sales_Platform' });
    });
  });

  describe('equals', () => {
    it('should treat contexts with same id as equal (case-insensitive)', () => {
      expect(BoundedContext.create('Sales').equals(BoundedContext.create('sales'))).toBe(true);
    });
  });

  describe('validation', () => {
    it('should reject name starting with number', () => {
      expect(() => BoundedContext.create('123Sales')).toThrow(
        'Context name must start with a letter and contain only letters, numbers, and underscores'
      );
    });

    it('should reject name with spaces', () => {
      expect(() => BoundedContext.create('Sales Platform')).toThrow(
        'Context name must start with a letter and contain only letters, numbers, and underscores'
      );
    });

    it('should reject empty name', () => {
      expect(() => BoundedContext.create('')).toThrow('Context name cannot be empty');
    });
  });
});

describe('Partnership', () => {
  const sales = BoundedContext.create('Sales');
  const marketing = BoundedContext.create('Marketing');

  it('should create a partnership between two contexts', () => {
    const relationship = Partnership.create(sales, marketing);
    expect(relationship).toEqual({ one: sales, other: marketing });
  });

  it('should reject self-referencing relationships', () => {
    expect(() => Partnership.create(sales, sales)).toThrow(
      'Self-referencing relationships are not allowed'
    );
  });

  describe('key', () => {
    it('should produce the same key regardless of direction', () => {
      expect(Partnership.create(sales, marketing).key()).toBe(
        Partnership.create(marketing, sales).key()
      );
    });
  });
});

describe('UpstreamDownstream', () => {
  const sales = BoundedContext.create('Sales');
  const marketing = BoundedContext.create('Marketing');

  it('should create an upstream/downstream relationship between two contexts', () => {
    const relationship = UpstreamDownstream.create(sales, marketing);
    expect(relationship).toEqual({ from: sales, to: marketing });
  });

  it('should reject self-referencing relationships', () => {
    expect(() => UpstreamDownstream.create(sales, sales)).toThrow(
      'Self-referencing relationships are not allowed'
    );
  });

  describe('key', () => {
    it('should produce different keys for different directions', () => {
      expect(UpstreamDownstream.create(sales, marketing).key()).not.toBe(
        UpstreamDownstream.create(marketing, sales).key()
      );
    });
  });
});
