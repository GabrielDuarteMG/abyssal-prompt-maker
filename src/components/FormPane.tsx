import {useEffect, useRef} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Heading} from '@astryxdesign/core/Heading';
import {Icon} from '@astryxdesign/core/Icon';
import {Kbd} from '@astryxdesign/core/Kbd';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {Step, Stepper} from '@astryxdesign/core/Stepper';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {STEPS} from '../lib/steps';
import {useWizardStore, type ViewMode} from '../store/wizardStore';
import {StepContent} from './StepContent';

const FIRST_CONTROL = 'input:not([type=hidden]), textarea, button:not(:disabled):not([aria-disabled="true"])';

export function FormPane() {
  const activeStep = useWizardStore((s) => s.activeStep);
  const viewMode = useWizardStore((s) => s.viewMode);
  const goToStep = useWizardStore((s) => s.goToStep);
  const setViewMode = useWizardStore((s) => s.setViewMode);
  const bodyRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Alt+Shift+N / Alt+Shift+P. e.code because Option changes e.key on macOS;
  // Alt+arrows (history) and Alt+digits (tab switching) are taken by browsers.
  useEffect(() => {
    if (viewMode !== 'wizard') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.isComposing || e.ctrlKey || e.metaKey || !e.altKey || !e.shiftKey) return;
      const delta = e.code === 'KeyN' ? 1 : e.code === 'KeyP' ? -1 : 0;
      if (delta === 0) return;
      e.preventDefault();
      const {activeStep: current, goToStep: go} = useWizardStore.getState();
      go(current + delta, 'field');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [viewMode]);

  // Navigation moves focus/scroll. First mount focuses the first field (sections remount on
  // every step/mode change, so they must not autofocus themselves).
  useEffect(() => {
    const body = bodyRef.current;
    if (body == null) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      body.querySelector<HTMLElement>(FIRST_CONTROL)?.focus();
      return;
    }
    const {focusTarget} = useWizardStore.getState();
    if (focusTarget === 'none') return;

    if (viewMode === 'wizard') {
      if (focusTarget === 'field') {
        body.querySelector<HTMLElement>(FIRST_CONTROL)?.focus();
        return;
      }
      body.scrollTop = 0;
      if (focusTarget === 'panel') body.focus({preventScroll: true});
      return;
    }

    const section = body.querySelector<HTMLElement>(`[data-step-id="${STEPS[activeStep].id}"]`);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    section?.scrollIntoView({block: 'start', behavior: reduced ? 'auto' : 'smooth'});
    if (focusTarget !== 'scroll') section?.focus({preventScroll: true});
  }, [activeStep, viewMode]);

  const step = STEPS[activeStep];

  return (
    <Card className="glass-card pane-card form-card" elevation="high" padding={0}>
      <header className="pane-header">
        <div className="title-row">
          <Heading level={1}>Abyssal Prompt Maker</Heading>
          <SegmentedControl
            label="Modo de edição"
            size="sm"
            value={viewMode}
            onChange={(v) => setViewMode(v as ViewMode)}>
            <SegmentedControlItem value="wizard" label="Passo a passo" />
            <SegmentedControlItem value="all" label="Ver tudo" />
          </SegmentedControl>
        </div>
        {viewMode === 'wizard' && (
          <Stepper
            activeStep={activeStep}
            onStepClick={(i) => goToStep(i)}
            label="Etapas do prompt"
            density="compact"
            horizontalOptions={{minimumStepWidth: 96, collapsedVariant: 'withLabel'}}>
            {STEPS.map((s, i) => (
              <Step key={s.id} step={i} label={s.label} indicator="number" />
            ))}
          </Stepper>
        )}
      </header>

      <div className="pane-body" ref={bodyRef} tabIndex={-1}>
        {viewMode === 'wizard' ? (
          <section aria-label={step.label} key={step.id}>
            <StepContent step={step.id} />
          </section>
        ) : (
          <VStack gap={6}>
            {STEPS.map((s, i) => (
              <section
                key={s.id}
                className="step-section"
                data-step-id={s.id}
                aria-label={s.label}
                tabIndex={-1}
                onFocusCapture={() => goToStep(i, 'none')}>
                <VStack gap={4}>
                  <Text color="secondary">{`Etapa ${i + 1} · ${s.label}`}</Text>
                  <StepContent step={s.id} />
                </VStack>
              </section>
            ))}
          </VStack>
        )}
      </div>

      {viewMode === 'wizard' && (
        <footer className="pane-footer wizard-footer">
          <Button
            label="Voltar"
            icon={<Icon icon="chevronLeft" />}
            variant="secondary"
            isDisabled={activeStep === 0}
            onClick={() => goToStep(activeStep - 1)}
            aria-keyshortcuts="Alt+Shift+P"
          />
          <div className="wizard-progress">
            <Text color="secondary">{`Etapa ${activeStep + 1} de ${STEPS.length}`}</Text>
            <span className="shortcut-hint">
              <Kbd keys="alt+shift+p" />
              <Kbd keys="alt+shift+n" />
            </span>
          </div>
          <Button
            label="Próximo"
            endContent={<Icon icon="chevronRight" />}
            variant="primary"
            isDisabled={activeStep === STEPS.length - 1}
            onClick={() => goToStep(activeStep + 1)}
            aria-keyshortcuts="Alt+Shift+N"
          />
        </footer>
      )}
    </Card>
  );
}
