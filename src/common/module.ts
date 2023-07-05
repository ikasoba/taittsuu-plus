export interface TpModule {
  main: () => void;
  exports: { [k: string]: any };
}

export const defineModule = <M extends TpModule>(module: M): M => (
  module.main(), module
);
