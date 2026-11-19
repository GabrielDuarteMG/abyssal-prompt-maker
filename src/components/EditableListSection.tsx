import {useEffect, useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {Icon} from '@astryxdesign/core/Icon';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Text} from '@astryxdesign/core/Text';
import {TextArea} from '@astryxdesign/core/TextArea';
import {TextInput} from '@astryxdesign/core/TextInput';
import {VStack} from '@astryxdesign/core/VStack';
import {type ListKey, usePromptStore} from '../store/promptStore';

type Props = {
  list: ListKey;
  title?: string;
  description?: string;
  itemLabel: string;
  addLabel: string;
  isOrdered?: boolean;
  /** Items are TextAreas with a visible numbered label; Ctrl/Cmd+Enter adds the next item. */
  isMultiline?: boolean;
};

export function EditableListSection({
  list,
  title,
  description,
  itemLabel,
  addLabel,
  isOrdered = false,
  isMultiline = false,
}: Props) {
  const items = usePromptStore((s) => s.lists[list]);
  const addItem = usePromptStore((s) => s.addItem);
  const updateItem = usePromptStore((s) => s.updateItem);
  const removeItem = usePromptStore((s) => s.removeItem);
  const moveItem = usePromptStore((s) => s.moveItem);
  const [focusID, setFocusID] = useState<string | null>(null);

  // Move focus to a newly added item so the user can type right away.
  useEffect(() => {
    if (focusID == null) return;
    document.querySelector<HTMLElement>(`[data-item-id="${focusID}"] :is(input, textarea)`)?.focus();
    setFocusID(null);
  }, [focusID]);

  const ListTag = isOrdered ? 'ol' : 'ul';
  const add = () => setFocusID(addItem(list));

  const remove = (index: number, id: string) => {
    removeItem(list, id);
    // Keep keyboard users in the list: focus the neighbour that took this slot.
    const next = items[index + 1] ?? items[index - 1];
    if (next) setFocusID(next.id);
  };

  return (
    <VStack gap={3}>
      {title != null && (
        <VStack gap={1}>
          <Heading level={2}>{title}</Heading>
          {description != null && <Text color="secondary">{description}</Text>}
        </VStack>
      )}

      {items.length > 0 && (
        <ListTag className="editable-list">
          {items.map((p, i) => (
            <li key={p.id} data-item-id={p.id}>
              <div className="list-row" data-multiline={isMultiline || undefined}>
                {!isMultiline && (
                  <Text color="secondary" aria-hidden>
                    <span className="item-marker">{isOrdered ? `${i + 1}.` : '•'}</span>
                  </Text>
                )}
                <div className="list-row-field">
                  {isMultiline ? (
                    <TextArea
                      label={`${itemLabel} ${i + 1}`}
                      rows={3}
                      value={p.text}
                      onChange={(text) => updateItem(list, p.id, text)}
                      onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                          e.preventDefault();
                          add();
                        }
                      }}
                    />
                  ) : (
                    <TextInput
                      label={`${itemLabel} ${i + 1}`}
                      isLabelHidden
                      value={p.text}
                      onChange={(text) => updateItem(list, p.id, text)}
                      placeholder={`${itemLabel} ${i + 1}`}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          add();
                        }
                      }}
                    />
                  )}
                </div>
                <div className="list-row-actions">
                  <IconButton
                    label={`Subir ${itemLabel.toLowerCase()} ${i + 1}`}
                    icon={<Icon icon="arrowUp" />}
                    variant="ghost"
                    size="sm"
                    isDisabled={i === 0}
                    onClick={() => moveItem(list, p.id, -1)}
                  />
                  <IconButton
                    label={`Descer ${itemLabel.toLowerCase()} ${i + 1}`}
                    icon={<Icon icon="arrowDown" />}
                    variant="ghost"
                    size="sm"
                    isDisabled={i === items.length - 1}
                    onClick={() => moveItem(list, p.id, 1)}
                  />
                  <IconButton
                    label={`Remover ${itemLabel.toLowerCase()} ${i + 1}`}
                    icon={<Icon icon="close" />}
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(i, p.id)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ListTag>
      )}

      <div>
        <Button label={addLabel} variant="secondary" onClick={add} />
      </div>
    </VStack>
  );
}
