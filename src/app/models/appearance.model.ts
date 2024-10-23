export enum IDensity {
    Compact = 'compact',
    Cozy = 'cozy',
    Roomy = 'roomy',
}

export enum ITheme {
    Light = 'light',
    Dark = 'dark',
    Auto = 'auto',
};

export interface IAppearanceContext {
    density: IDensity;
    theme: ITheme;
}
