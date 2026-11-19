import {Selector} from '@astryxdesign/core/Selector';
import {TextInput} from '@astryxdesign/core/TextInput';
import {VStack} from '@astryxdesign/core/VStack';
import {SUMMARY_VERBS, type SummaryVerb, usePromptStore} from '../store/promptStore';

export function SummarySection() {
  const summary = usePromptStore((s) => s.summary);
  const setSummary = usePromptStore((s) => s.setSummary);

  return (
    <VStack gap={3}>
      <div className="summary-row">
        <div>
          <Selector
            label="Resumo"
            hasSearch
            searchPlaceholder="Buscar verbo"
            emptySearchText="Nenhum verbo encontrado"
            options={[...SUMMARY_VERBS]}
            value={summary.verb}
            onChange={(verb) => setSummary({verb: verb as SummaryVerb})}
          />
        </div>
        <div>
          <TextInput
            label="O quê"
            value={summary.task}
            onChange={(task) => setSummary({task})}
            placeholder="uma landing page para minha marca"
          />
        </div>
      </div>
      <TextInput
        label="Precisas somente"
        description="Limite o escopo: o que é estritamente necessário."
        value={summary.scope}
        onChange={(scope) => setSummary({scope})}
        placeholder="do HTML e CSS, sem frameworks"
      />
    </VStack>
  );
}
