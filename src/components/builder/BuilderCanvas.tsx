'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useResumeStore } from '../../../lib/stores/resumeStore';
import type { ResumeSection } from '../../../lib/types/resume';
import { useSectionDrag } from '../../../lib/hooks/useDragAndDrop';
import DraggableSection from './DraggableSection';

const orderSections = (sections: ResumeSection[]): ResumeSection[] => {
  const sorted = [...sections].sort((left, right) => left.sortOrder - right.sortOrder);
  const personalInfo = sorted.find((section) => section.type === 'personal_info');
  const others = sorted.filter((section) => section.type !== 'personal_info');
  return personalInfo ? [personalInfo, ...others] : others;
};

export default function BuilderCanvas() {
  const resume = useResumeStore((state) => state.resume);
  const activeSection = useResumeStore((state) => state.activeSection);
  const setActiveSection = useResumeStore((state) => state.setActiveSection);

  const {
    sensors,
    handleDragStart,
    handleDragCancel,
    handleDragEnd: hookDragEnd,
    activeId,
  } = useSectionDrag();

  const [draggingId, setDraggingId] = useState<string | null>(null);

  const orderedSections = useMemo(() => {
    if (!resume) {
      return [];
    }
    return orderSections(resume.sections);
  }, [resume]);

  const onDragStart = useCallback(
    (event: DragStartEvent): void => {
      setDraggingId(String(event.active.id));
      handleDragStart(event);
    },
    [handleDragStart]
  );

  if (!resume || orderedSections.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-sm text-zinc-500">
        No sections available yet.
      </div>
    );
  }

  const draggedSection = orderedSections.find((section) => section.id === (draggingId ?? activeId));

  return (
    <div className="h-full overflow-y-auto pr-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragCancel={(event) => {
          setDraggingId(null);
          handleDragCancel(event);
        }}
        onDragEnd={(event) => {
          setDraggingId(null);
          void hookDragEnd(event);
        }}
      >
        <SortableContext
          items={orderedSections.map((section) => section.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {orderedSections.map((section) => (
              <DraggableSection key={section.id} section={section} isSelected={activeSection === section.id}>
                <button
                  type="button"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left text-sm text-zinc-600 hover:border-zinc-300"
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.items.length} item{section.items.length === 1 ? '' : 's'} in this section
                </button>
              </DraggableSection>
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {draggedSection ? (
            <div className="rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-lg">
              {draggedSection.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
