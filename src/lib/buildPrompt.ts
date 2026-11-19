import type {CustomList, ListItem, Summary} from '../store/promptStore';
import type {StepId} from './steps';

export type PromptInput = {
  goal: string;
  summary: Summary;
  lists: Record<string, ListItem[]>;
  customLists: CustomList[];
  notes: string;
  doneWhen: string;
};

const stripEndPeriod = (s: string) => s.trim().replace(/\.+$/, '');

/** "Construa X. Ela só precisa Y." — empty parts are dropped. */
export function formatSummary({verb, task, scope}: Summary): string {
  const t = stripEndPeriod(task);
  const sc = stripEndPeriod(scope);
  const parts: string[] = [];
  if (t) parts.push(`${verb} ${t}.`);
  if (sc) parts.push(`Ela só precisa ${sc}.`);
  return parts.join(' ');
}

const texts = (items: ListItem[] | undefined) =>
  (items ?? []).map((it) => it.text.trim()).filter(Boolean);

// Continuation lines of a multiline item are indented under its marker.
const indent = (text: string, pad: string) => text.replace(/\n/g, `\n${pad}`);

function listBlock(header: string, items: string[], ordered = false): string | null {
  if (items.length === 0) return null;
  const lines = items.map((t, i) => {
    const marker = ordered ? `${i + 1}. ` : '- ';
    return marker + indent(t, ' '.repeat(marker.length));
  });
  return `${header}\n${lines.join('\n')}`;
}

export type PromptBlock = {step: StepId; text: string};

export function buildPromptBlocks(p: PromptInput): PromptBlock[] {
  const goal = p.goal.trim();
  const notes = p.notes.trim();
  const doneWhen = p.doneWhen.trim();

  const blocks: [StepId, string | null][] = [
    ['objective', goal || null],
    ['objective', formatSummary(p.summary) || null],
    ['priorities', listBlock('PRIORIDADES (nesta ordem, quando entrarem em conflito)', texts(p.lists.priorities), true)],
    ['restrictions', listBlock('RESTRIÇÕES', texts(p.lists.restrictions))],
    ['targets', listBlock('ALVO', texts(p.lists.targets))],
    ...p.customLists.map((l, i): [StepId, string | null] => [
      'extras',
      listBlock((l.title.trim() || `Lista ${i + 1}`).toUpperCase(), texts(p.lists[l.id])),
    ]),
    ['extras', notes ? `OBSERVAÇÃO\n${notes}` : null],
    ['verification', listBlock('VERIFICAÇÃO', texts(p.lists.verification))],
    ['verification', doneWhen ? `CONCLUÍDO QUANDO: ${doneWhen}` : null],
  ];

  return blocks.flatMap(([step, text]) => (text == null ? [] : [{step, text}]));
}

export const joinPromptBlocks = (blocks: PromptBlock[]): string =>
  blocks.map((b) => b.text).join('\n\n');
