import type {
  DefaultSharedCoreModuleContext,
  LangiumCoreServices,
  LangiumSharedCoreServices,
  Module,
  PartialLangiumCoreServices,
} from 'langium';
import {
  EmptyFileSystem,
  createDefaultCoreModule,
  createDefaultSharedCoreModule,
  inject,
} from 'langium';

import { CommonValueConverter } from '../common/index.js';
import { MermaidGeneratedSharedModule, ContextMapGeneratedModule } from '../generated/module.js';
import { ContextMapTokenBuilder } from './tokenBuilder.js';

interface ContextMapAddedServices {
  parser: {
    TokenBuilder: ContextMapTokenBuilder;
    ValueConverter: CommonValueConverter;
  };
}

export type ContextMapServices = LangiumCoreServices & ContextMapAddedServices;

export const ContextMapModule: Module<
  ContextMapServices,
  PartialLangiumCoreServices & ContextMapAddedServices
> = {
  parser: {
    TokenBuilder: () => new ContextMapTokenBuilder(),
    ValueConverter: () => new CommonValueConverter(),
  },
};

export function createContextMapServices(
  context: DefaultSharedCoreModuleContext = EmptyFileSystem
): {
  shared: LangiumSharedCoreServices;
  ContextMap: ContextMapServices;
} {
  const shared: LangiumSharedCoreServices = inject(
    createDefaultSharedCoreModule(context),
    MermaidGeneratedSharedModule
  );
  const ContextMap: ContextMapServices = inject(
    createDefaultCoreModule({ shared }),
    ContextMapGeneratedModule,
    ContextMapModule
  );
  shared.ServiceRegistry.register(ContextMap);
  return { shared, ContextMap };
}
