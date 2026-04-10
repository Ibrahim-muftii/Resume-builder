'use client';

import { useCallback, useState } from 'react';
import {
  KeyboardSensor,
  PointerSensor,
  type DragCancelEvent,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useResumeStore } from '../stores/resumeStore';
import type { ResumeSection, SectionItem } from '../types/resume';

type DragHookResult = {
  sensors: ReturnType<typeof useSensors>;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragCancel: (event: DragCancelEvent) => void;
  activeId: string | null;
};

type BaseDragState = {
  sensors: ReturnType<typeof useSensors>;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragCancel: (event: DragCancelEvent) => void;
  activeId: string | null;
  clearActiveId: () => void;
};

const normalizeSectionOrder = (sections: ResumeSection[]): ResumeSection[] => {
  // Work with the array order directly, not by sortOrder (which is outdated)
  let orderedSections = [...sections];
  const personalInfoIndex = orderedSections.findIndex((section) => section.type === 'personal_info');

  // Move personal_info to the front if it's not already
  if (personalInfoIndex > 0) {
    const [personalInfoSection] = orderedSections.splice(personalInfoIndex, 1);
    orderedSections.unshift(personalInfoSection);
  }

  // Update sortOrder to match array position
  return orderedSections.map((section, index) => ({
    ...section,
    sortOrder: index,
  }));
};

const getUniqueId = (id: UniqueIdentifier): string => String(id);



const useBaseDragState = (): BaseDragState => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(getUniqueId(event.active.id));
  }, []);

  const handleDragCancel = useCallback((_event: DragCancelEvent) => {
    setActiveId(null);
  }, []);

  const clearActiveId = useCallback(() => {
    setActiveId(null);
  }, []);

  return {
    sensors,
    handleDragStart,
    handleDragCancel,
    activeId,
    clearActiveId,
  };
};

export function useSectionDrag(): DragHookResult {
  const { sensors, handleDragStart, handleDragCancel, activeId, clearActiveId } =
    useBaseDragState();
  const resume = useResumeStore((state) => state.resume);
  const reorderSections = useResumeStore((state) => state.reorderSections);
  const setActiveSection = useResumeStore((state) => state.setActiveSection);
  const setDirty = useResumeStore((state) => state.setDirty);

  const handleDragEnd = useCallback(
    (event: DragEndEvent): void => {
      if (!resume || !event.over) {
        clearActiveId();
        return;
      }

      const activeSectionId = getUniqueId(event.active.id);
      const overSectionId = getUniqueId(event.over.id);

      setActiveSection(activeSectionId);

      if (activeSectionId === overSectionId) {
        clearActiveId();
        return;
      }

      const orderedSections = [...resume.sections].sort(
        (left, right) => left.sortOrder - right.sortOrder
      );
      const activeIndex = orderedSections.findIndex((section) => section.id === activeSectionId);
      const overIndex = orderedSections.findIndex((section) => section.id === overSectionId);

      if (activeIndex < 0 || overIndex < 0) {
        clearActiveId();
        return;
      }

      const nextSections = normalizeSectionOrder(
        arrayMove(orderedSections, activeIndex, overIndex)
      );

      // Update local state
      reorderSections(nextSections);
      setDirty(true);

      // Persist to API
      fetch(`/api/resume/${resume.id}/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: nextSections.map((section) => ({
            id: section.id,
            sortOrder: section.sortOrder,
          })),
        }),
      }).catch((error) => {
        console.error('Failed to persist section order:', error);
      });

      clearActiveId();
    },
    [clearActiveId, reorderSections, resume, setActiveSection, setDirty]
  );

  return {
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    activeId,
  };
}

export function useItemDrag(sectionId: string | null): DragHookResult {
  const { sensors, handleDragStart, handleDragCancel, activeId, clearActiveId } =
    useBaseDragState();
  const resume = useResumeStore((state) => state.resume);
  const reorderItems = useResumeStore((state) => state.reorderItems);
  const setActiveItem = useResumeStore((state) => state.setActiveItem);
  const setDirty = useResumeStore((state) => state.setDirty);

  const handleDragEnd = useCallback(
    (event: DragEndEvent): void => {
      if (!resume || !event.over || !sectionId) {
        clearActiveId();
        return;
      }

      const section = resume.sections.find((candidate) => candidate.id === sectionId);

      if (!section) {
        clearActiveId();
        return;
      }

      const activeItemId = getUniqueId(event.active.id);
      const overItemId = getUniqueId(event.over.id);

      setActiveItem(activeItemId);

      if (activeItemId === overItemId) {
        clearActiveId();
        return;
      }

      const orderedItems = [...(section.items as SectionItem[])].sort(
        (left, right) => left.sortOrder - right.sortOrder
      );
      const activeIndex = orderedItems.findIndex((item) => item.id === activeItemId);
      const overIndex = orderedItems.findIndex((item) => item.id === overItemId);

      if (activeIndex < 0 || overIndex < 0) {
        clearActiveId();
        return;
      }

      const nextItems = arrayMove(orderedItems, activeIndex, overIndex).map((item, index) => ({
        ...item,
        sectionId,
        sortOrder: index,
      }));

      // Update local state
      reorderItems(sectionId, nextItems);
      setDirty(true);

      // Persist to API
      fetch(`/api/resume/${resume.id}/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              sectionId,
              items: nextItems.map((item) => ({
                id: item.id,
                sortOrder: item.sortOrder,
              })),
            },
          ],
        }),
      }).catch((error) => {
        console.error('Failed to persist item order:', error);
      });

      clearActiveId();
    },
    [clearActiveId, reorderItems, resume, sectionId, setActiveItem, setDirty]
  );

  return {
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    activeId,
  };
}