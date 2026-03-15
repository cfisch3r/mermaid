// Context Map Detector
// Placeholder for detector implementation

import type {
  DiagramDetector,
  DiagramLoader,
  ExternalDiagramDefinition,
} from '../../diagram-api/types.js';

const id = 'contextMap';

const detector: DiagramDetector = (txt) => /^\s*contextMap/.test(txt);

const loader: DiagramLoader = async () => {
  const { diagram } = await import('./contextMapDiagram.js');
  return { id, diagram };
};

export const contextMap: ExternalDiagramDefinition = {
  id,
  detector,
  loader,
};
