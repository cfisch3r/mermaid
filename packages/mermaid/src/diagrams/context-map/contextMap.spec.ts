// Context Map Integration Tests
// Tests for detector and parser integration

import { describe, it, expect, beforeEach } from 'vitest';
import { db } from './contextMapDb.js';
import { contextMap } from './contextMapDetector.js';
import { parser } from './contextMapParser.js';
import { BoundedContext, Partnership, UpstreamDownstream } from './contextMapTypes.js';

describe('contextMap', () => {
  beforeEach(() => {
    db.clear();
  });

  describe('Detector', () => {
    it.each(['contextMap', 'contextMap\n  context Sales', '  contextMap'])(
      'should detect "%s" as a contextMap diagram',
      (text) => {
        expect(contextMap.detector(text)).toBe(true);
      }
    );

    it.each(['flowchart LR', 'sequenceDiagram', ''])(
      'should reject "%s" as not a contextMap diagram',
      (text) => {
        expect(contextMap.detector(text)).toBe(false);
      }
    );
  });

  describe('Parser', () => {
    it('should parse a single context declaration', async () => {
      await parser.parse('contextMap\n  context Sales');

      expect(db.getContexts()).toEqual([BoundedContext.create('Sales')]);
    });
  });
});
