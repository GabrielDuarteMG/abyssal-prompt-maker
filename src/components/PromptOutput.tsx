import {Fragment, useEffect, useId, useMemo, useRef, useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Heading} from '@astryxdesign/core/Heading';
import {Icon} from '@astryxdesign/core/Icon';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Text} from '@astryxdesign/core/Text';
import {useShallow} from 'zustand/react/shallow';
import {buildPromptBlocks, joinPromptBlocks} from '../lib/buildPrompt';
import {STEPS, stepIndex} from '../lib/steps';
import {usePromptStore} from '../store/promptStore';
import {useWizardStore} from '../store/wizardStore';

export function PromptOutput() {
  const input = usePromptStore(
    useShallow((s) => ({
      goal: s.goal,
      summary: s.summary,
      lists: s.lists,
      customLists: s.customLists,
      notes: s.notes,
      doneWhen: s.doneWhen,
    })),
  );
  const blocks = useMemo(() => buildPromptBlocks(input), [input]);
  const prompt = useMemo(() => joinPromptBlocks(blocks), [blocks]);
  const activeStep = useWizardStore((s) => s.activeStep);
  const goToStep = useWizardStore((s) => s.goToStep);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const previewID = useId();
  const previewRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  // Bring the active step's block into view when the step changes.
  useEffect(() => {
    const c = previewRef.current;
    const el = c?.querySelector<HTMLElement>('[data-active]');
    if (c == null || el == null) return;
    const isVisible = el.offsetTop >= c.scrollTop && el.offsetTop + el.offsetHeight <= c.scrollTop + c.clientHeight;
    if (!isVisible) {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      c.scrollTo({top: el.offsetTop - 8, behavior: reduced ? 'auto' : 'smooth'});
    }
  }, [activeStep]);

  // Follow typing at the end of a long active block.
  useEffect(() => {
    const c = previewRef.current;
    const el = c?.querySelector<HTMLElement>('[data-active]');
    if (c == null || el == null) return;
    const bottom = el.offsetTop + el.offsetHeight;
    if (bottom > c.scrollTop + c.clientHeight) {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      c.scrollTo({top: bottom - c.clientHeight + 8, behavior: reduced ? 'auto' : 'smooth'});
    }
  }, [prompt]);

  const copy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
  };

  const active = STEPS[activeStep];
  const hasActiveBlock = blocks.some((b) => b.step === active.id);
  const placeholderAt = hasActiveBlock
    ? -1
    : (() => {
        const i = blocks.findIndex((b) => stepIndex(b.step) > activeStep);
        return i === -1 ? blocks.length : i;
      })();
  const placeholder = (
    <li className="prompt-block is-placeholder" data-active>
      {`${active.label} — ainda vazio`}
    </li>
  );

  return (
    <aside className="preview-pane" data-expanded={isExpanded || undefined}>
      <Card className="glass-card pane-card preview-card" elevation="high" padding={0}>
        <div className="pane-header preview-header">
          <Heading level={2}>Prompt</Heading>
          <Text color="secondary" aria-live="polite">
            {`${prompt.length.toLocaleString('pt-BR')} caracteres`}
          </Text>
          <Button
            label={copied ? 'Copiado' : 'Copiar'}
            icon={<Icon icon={copied ? 'check' : 'copy'} />}
            variant="primary"
            isDisabled={prompt === ''}
            onClick={copy}
          />
          <IconButton
            className="dock-toggle"
            label={isExpanded ? 'Recolher prévia' : 'Expandir prévia'}
            icon={<Icon icon={isExpanded ? 'chevronDown' : 'arrowUp'} />}
            variant="ghost"
            size="sm"
            aria-expanded={isExpanded}
            aria-controls={previewID}
            onClick={() => setIsExpanded((x) => !x)}
          />
        </div>
        <ol
          id={previewID}
          ref={previewRef}
          className="pane-body prompt-preview"
          aria-label="Prompt gerado"
          tabIndex={0}>
          {blocks.length === 0 ? (
            <li className="prompt-empty">
              <Text color="secondary">Preencha as etapas e o prompt aparece aqui.</Text>
            </li>
          ) : (
            <>
              {blocks.map((b, i) => {
                const index = stepIndex(b.step);
                return (
                  <Fragment key={i}>
                    {i === placeholderAt && placeholder}
                    <li
                      className="prompt-block"
                      data-step-id={b.step}
                      data-active={b.step === active.id || undefined}
                      title={`Editar etapa ${STEPS[index].label}`}
                      onClick={() => {
                        // Don't hijack a text selection inside the block.
                        if (window.getSelection()?.toString()) return;
                        goToStep(index);
                        setIsExpanded(false);
                      }}>
                      <pre>{b.text}</pre>
                    </li>
                  </Fragment>
                );
              })}
              {placeholderAt === blocks.length && placeholder}
            </>
          )}
        </ol>
      </Card>
    </aside>
  );
}
