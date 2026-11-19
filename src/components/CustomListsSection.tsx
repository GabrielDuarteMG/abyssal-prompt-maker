import {useEffect, useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {VStack} from '@astryxdesign/core/VStack';
import {usePromptStore} from '../store/promptStore';
import {EditableListSection} from './EditableListSection';

export function CustomListsSection() {
  const customLists = usePromptStore((s) => s.customLists);
  const addCustomList = usePromptStore((s) => s.addCustomList);
  const renameCustomList = usePromptStore((s) => s.renameCustomList);
  const removeCustomList = usePromptStore((s) => s.removeCustomList);
  const [focusID, setFocusID] = useState<string | null>(null);

  // Focus the title of a newly created list so the user names it first.
  useEffect(() => {
    if (focusID == null) return;
    document.querySelector<HTMLInputElement>(`[data-custom-list-id="${focusID}"] input`)?.focus();
    setFocusID(null);
  }, [focusID]);

  return (
    <VStack gap={3}>
      <VStack gap={1}>
        <Heading level={2}>Listas personalizadas</Heading>
        <Text color="secondary">Características específicas deste pedido.</Text>
      </VStack>

      {customLists.map((l, i) => {
        const name = l.title.trim() || `Lista ${i + 1}`;
        return (
          <div key={l.id} className="custom-list" data-custom-list-id={l.id}>
            <VStack gap={3}>
              <HStack gap={2} align="end">
                <div style={{flex: 1, minWidth: 0}}>
                  <TextInput
                    label="Nome da lista"
                    value={l.title}
                    onChange={(title) => renameCustomList(l.id, title)}
                    placeholder="Ex.: Funcionalidades, Paleta de cores, Integrações"
                  />
                </div>
                <IconButton
                  label={`Remover lista ${name}`}
                  icon={<Icon icon="close" />}
                  variant="ghost"
                  onClick={() => removeCustomList(l.id)}
                />
              </HStack>
              <EditableListSection list={l.id} itemLabel="Item" addLabel="Adicionar item" />
            </VStack>
          </div>
        );
      })}

      <div>
        <Button label="Criar lista" variant="secondary" onClick={() => setFocusID(addCustomList())} />
      </div>
    </VStack>
  );
}
