import {create} from 'zustand';
import {STEPS} from '../lib/steps';

export type ViewMode = 'wizard' | 'all';

/**
 * What FormPane does after activeStep/viewMode changes:
 * - field: focus the step's first control (keyboard shortcut; the user was typing)
 * - panel: focus the step container without opening a virtual keyboard (buttons, stepper, preview)
 * - scroll: only scroll to the step (mode switch; keeps focus on the toggle)
 * - none: nothing (passive tracking of focus in "Ver tudo")
 */
export type FocusTarget = 'field' | 'panel' | 'scroll' | 'none';

type WizardState = {
  activeStep: number;
  viewMode: ViewMode;
  focusTarget: FocusTarget;
  goToStep: (index: number, focusTarget?: FocusTarget) => void;
  setViewMode: (mode: ViewMode) => void;
};

export const useWizardStore = create<WizardState>()((set) => ({
  activeStep: 0,
  viewMode: 'wizard',
  focusTarget: 'none',
  goToStep: (index, focusTarget = 'panel') =>
    set({activeStep: Math.min(Math.max(index, 0), STEPS.length - 1), focusTarget}),
  setViewMode: (viewMode) => set({viewMode, focusTarget: 'scroll'}),
}));
