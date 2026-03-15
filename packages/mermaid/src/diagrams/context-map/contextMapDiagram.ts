// Context Map Diagram Definition
// Wires together parser, db, and renderer

import type { DiagramDefinition } from '../../diagram-api/types.js';
import { parser } from './contextMapParser.js';
import { db } from './contextMapDb.js';
import { draw } from './contextMapRenderer.js';

export const diagram: DiagramDefinition = {
  parser,
  db,
  renderer: draw,
};
