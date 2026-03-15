// Context Map Database Tests

import { describe, it, expect, beforeEach } from 'vitest';
import { ContextMapDB } from './contextMapDb.js';
import { BoundedContext, Partnership, UpstreamDownstream } from './contextMapTypes.js';

describe('ContextMapDB', () => {
  let db: ContextMapDB;

  beforeEach(() => {
    db = new ContextMapDB();
    db.clear();
  });

  describe('addContext and getContexts', () => {
    it('should add a single context to empty database', () => {
      const sales = BoundedContext.create('Sales');
      db.addContext(sales);
      expect(db.getContexts()).toEqual([sales]);
    });

    it('should add multiple contexts', () => {
      const sales = BoundedContext.create('Sales');
      const inventory = BoundedContext.create('Inventory');
      const marketing = BoundedContext.create('Marketing');
      db.addContext(sales);
      db.addContext(inventory);
      db.addContext(marketing);
      expect(db.getContexts()).toEqual([sales, inventory, marketing]);
    });
  });

  describe('duplicate context validation', () => {
    it('should throw error when adding duplicate context', () => {
      const sales = BoundedContext.create('Sales');
      db.addContext(sales);
      expect(() => db.addContext(BoundedContext.create('Sales'))).toThrow(
        "Context 'Sales' already exists"
      );
    });
  });

  describe('addRelationship', () => {
    it('should add a partnership relationship between two contexts', () => {
      const sales = BoundedContext.create('Sales');
      const marketing = BoundedContext.create('Marketing');
      db.addContext(sales);
      db.addContext(marketing);

      db.addRelationship(Partnership.create(sales, marketing));

      expect(db.getRelationships()).toEqual([{ one: sales, other: marketing }]);
    });
  });

  describe('relationship validation', () => {
    const sales = BoundedContext.create('Sales');
    const inventory = BoundedContext.create('Inventory');
    const marketing = BoundedContext.create('Marketing');

    it.each([
      { existing: sales, relationship: Partnership.create(inventory, sales), missing: 'Inventory' },
      { existing: inventory, relationship: Partnership.create(inventory, sales), missing: 'Sales' },
    ])(
      'should throw when $missing context does not exist in database',
      ({ existing, relationship, missing }) => {
        db.addContext(existing);

        expect(() => db.addRelationship(relationship)).toThrow(`Context '${missing}' not found`);
      }
    );

    it.each([
      {
        from: sales,
        to: marketing,
        expectedMessage: "Relationship between 'Sales' and 'Marketing' already exists",
        label: 'same direction',
      },
      {
        from: marketing,
        to: sales,
        expectedMessage: "Relationship between 'Marketing' and 'Sales' already exists",
        label: 'reversed direction',
      },
    ])('should throw on duplicate partnership ($label)', ({ from, to, expectedMessage }) => {
      db.addContext(sales);
      db.addContext(marketing);
      db.addRelationship(Partnership.create(sales, marketing));

      expect(() => db.addRelationship(Partnership.create(from, to))).toThrow(expectedMessage);
    });

    it.each([
      {
        existing: Partnership.create(sales, marketing),
        incoming: UpstreamDownstream.create(sales, marketing),
        label: 'partnership then upstream/downstream',
      },
      {
        existing: UpstreamDownstream.create(sales, marketing),
        incoming: Partnership.create(sales, marketing),
        label: 'upstream/downstream then partnership',
      },
    ] as const)('should throw on conflicting types ($label)', ({ existing, incoming }) => {
      db.addContext(sales);
      db.addContext(marketing);
      db.addRelationship(existing);

      expect(() => db.addRelationship(incoming)).toThrow(
        "Conflicting relationship types between 'Sales' and 'Marketing'"
      );
    });
  });
});
