import {create} from 'zustand';

export const SUMMARY_VERBS = [
  'Adapte',
  'Ajuste',
  'Analise',
  'Avalie',
  'Classifique',
  'Compare',
  'Construa',
  'Converta',
  'Corrija',
  'Crie',
  'Critique',
  'Defina',
  'Depure',
  'Descreva',
  'Diagnostique',
  'Documente',
  'Elabore',
  'Escreva',
  'Especifique',
  'Estruture',
  'Execute',
  'Explique',
  'Extraia',
  'Faça',
  'Formate',
  'Gere',
  'Identifique',
  'Implemente',
  'Instrua',
  'Liste',
  'Melhore',
  'Organize',
  'Otimize',
  'Planeje',
  'Priorize',
  'Projete',
  'Reescreva',
  'Refatore',
  'Resuma',
  'Revise',
  'Simplifique',
  'Teste',
  'Traduza',
  'Valide',
  'Verifique',
] as const;
export type SummaryVerb = (typeof SUMMARY_VERBS)[number];

export type Summary = {
  verb: SummaryVerb;
  task: string;
  scope: string;
};

export type ListItem = {
  id: string;
  text: string;
};

export type FixedListKey = 'priorities' | 'restrictions' | 'targets' | 'verification';
// Fixed lists use their name as key; custom lists use their generated id.
export type ListKey = FixedListKey | (string & {});

export type CustomList = {
  id: string;
  title: string;
};

const initialSummary: Summary = {verb: 'Construa', task: '', scope: ''};
const initialLists: Record<string, ListItem[]> = {priorities: [], restrictions: [], targets: [], verification: []};

type PromptState = {
  goal: string;
  setGoal: (goal: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  doneWhen: string;
  setDoneWhen: (doneWhen: string) => void;
  summary: Summary;
  setSummary: (patch: Partial<Summary>) => void;
  lists: Record<string, ListItem[]>;
  customLists: CustomList[];
  addCustomList: () => string;
  renameCustomList: (id: string, title: string) => void;
  removeCustomList: (id: string) => void;
  addItem: (list: ListKey) => string;
  updateItem: (list: ListKey, id: string, text: string) => void;
  removeItem: (list: ListKey, id: string) => void;
  moveItem: (list: ListKey, id: string, delta: -1 | 1) => void;
  reset: () => void;
};

export const usePromptStore = create<PromptState>()((set) => {
  const setList = (list: ListKey, fn: (items: ListItem[]) => ListItem[]) =>
    set((s) => ({lists: {...s.lists, [list]: fn(s.lists[list] ?? [])}}));

  return {
    goal: '',
    setGoal: (goal) => set({goal}),
    notes: '',
    setNotes: (notes) => set({notes}),
    doneWhen: '',
    setDoneWhen: (doneWhen) => set({doneWhen}),
    summary: initialSummary,
    setSummary: (patch) => set((s) => ({summary: {...s.summary, ...patch}})),
    lists: initialLists,
    customLists: [],
    addCustomList: () => {
      const id = crypto.randomUUID();
      set((s) => ({
        customLists: [...s.customLists, {id, title: ''}],
        lists: {...s.lists, [id]: []},
      }));
      return id;
    },
    renameCustomList: (id, title) =>
      set((s) => ({customLists: s.customLists.map((l) => (l.id === id ? {...l, title} : l))})),
    removeCustomList: (id) =>
      set((s) => {
        const {[id]: _removed, ...lists} = s.lists;
        return {customLists: s.customLists.filter((l) => l.id !== id), lists};
      }),
    addItem: (list) => {
      const id = crypto.randomUUID();
      setList(list, (items) => [...items, {id, text: ''}]);
      return id;
    },
    updateItem: (list, id, text) =>
      setList(list, (items) => items.map((it) => (it.id === id ? {...it, text} : it))),
    removeItem: (list, id) => setList(list, (items) => items.filter((it) => it.id !== id)),
    moveItem: (list, id, delta) =>
      setList(list, (items) => {
        const i = items.findIndex((it) => it.id === id);
        const j = i + delta;
        if (i === -1 || j < 0 || j >= items.length) return items;
        const next = items.slice();
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      }),
    reset: () => set({goal: '', notes: '', doneWhen: '', summary: initialSummary, lists: initialLists, customLists: []}),
  };
});
