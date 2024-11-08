export type TaniaPhase = 'FormSelection' | 'FormFilling';
export type TaniaMode = 'Talking' | 'Listening' | 'Thinking';

export interface TaniaState {
  phase: TaniaPhase;
  taniaMode: TaniaMode;
  setPhase: (phase: TaniaPhase) => void;
  setTaniaMode: (mode: TaniaMode) => void;
}
