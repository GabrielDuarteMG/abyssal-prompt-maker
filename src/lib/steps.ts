/** Wizard steps, in the same order their blocks appear in the generated prompt. */
export const STEPS = [
  {id: 'objective', label: 'Objetivo'},
  {id: 'priorities', label: 'Prioridades'},
  {id: 'restrictions', label: 'Restrições'},
  {id: 'targets', label: 'Alvo'},
  {id: 'extras', label: 'Extras'},
  {id: 'verification', label: 'Verificação'},
] as const;

export type StepId = (typeof STEPS)[number]['id'];

export const stepIndex = (id: StepId): number => STEPS.findIndex((s) => s.id === id);
