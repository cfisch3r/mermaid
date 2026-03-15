import type { ContextMap } from '@mermaid-js/parser';
import { parse } from '@mermaid-js/parser';
import type { ParserDefinition } from '../../diagram-api/types.js';
import { db } from './contextMapDb.js';
import { BoundedContext, Partnership, UpstreamDownstream } from './contextMapTypes.js';

export const parser: ParserDefinition = {
  parse: async (input: string): Promise<void> => {
    const ast: ContextMap = await parse('contextMap', input);

    db.clear();

    for (const context of ast.contexts) {
      db.addContext(BoundedContext.create(context.name));
    }

    for (const p of ast.partnerships) {
      const one = db.getContexts().find((c) => c.id === p.one.toLowerCase())!;
      const other = db.getContexts().find((c) => c.id === p.other.toLowerCase())!;
      db.addRelationship(Partnership.create(one, other));
    }

    for (const ud of ast.upstreamDownstreamRelationships) {
      const from = db.getContexts().find((c) => c.id === ud.from.toLowerCase())!;
      const to = db.getContexts().find((c) => c.id === ud.to.toLowerCase())!;
      db.addRelationship(UpstreamDownstream.create(from, to));
    }
  },
};
