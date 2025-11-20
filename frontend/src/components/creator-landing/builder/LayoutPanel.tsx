'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreatorLandingPage, LandingSection, AVAILABLE_SECTIONS, SectionType } from '@/types/creator-landing';
import { GripVertical, Plus, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface LayoutPanelProps {
  landingPage: CreatorLandingPage;
  onUpdate: (updates: Partial<CreatorLandingPage>) => void;
}

interface SortableSectionProps {
  section: LandingSection;
  onToggle: (id: string) => void;
}

function SortableSection({ section, onToggle }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-background border rounded-lg ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{section.title}</div>
        <div className="text-xs text-muted-foreground truncate">{section.description}</div>
      </div>

      <button
        onClick={() => onToggle(section.id)}
        className="text-muted-foreground hover:text-foreground"
      >
        {section.enabled ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export default function LayoutPanel({ landingPage, onUpdate }: LayoutPanelProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = landingPage.sections.findIndex((s) => s.id === active.id);
      const newIndex = landingPage.sections.findIndex((s) => s.id === over.id);

      const newSections = arrayMove(landingPage.sections, oldIndex, newIndex).map(
        (section: LandingSection, index: number) => ({
          ...section,
          order: index,
        })
      );

      onUpdate({ sections: newSections });
    }
  };

  const toggleSection = (id: string) => {
    const newSections = landingPage.sections.map((section) =>
      section.id === id ? { ...section, enabled: !section.enabled } : section
    );
    onUpdate({ sections: newSections });
  };

  const addSection = (type: SectionType) => {
    const sectionInfo = AVAILABLE_SECTIONS.find((s) => s.type === type);
    if (!sectionInfo) return;

    const newSection: LandingSection = {
      id: `${type}-${Date.now()}`,
      type,
      title: sectionInfo.label,
      description: sectionInfo.description,
      order: landingPage.sections.length,
      enabled: true,
      config: {},
    };

    onUpdate({ sections: [...landingPage.sections, newSection] });
    setShowAddMenu(false);
  };

  const availableSectionsToAdd = AVAILABLE_SECTIONS.filter(
    (availableSection) =>
      !landingPage.sections.some((section) => section.type === availableSection.type)
  );

  return (
    <div className="space-y-4">
      {/* Info Text */}
      <div className="text-sm text-muted-foreground">
        Some content, like in-progress events and membership tiers, will automatically appear on your page.
      </div>

      {/* Sections List */}
      <div className="space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={landingPage.sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {landingPage.sections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                onToggle={toggleSection}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Add Section Button */}
      <div className="relative">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowAddMenu(!showAddMenu)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>

        {showAddMenu && availableSectionsToAdd.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
            {availableSectionsToAdd.map((section) => (
              <button
                key={section.type}
                onClick={() => addSection(section.type)}
                className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b last:border-b-0"
              >
                <div className="font-medium text-sm">{section.label}</div>
                <div className="text-xs text-muted-foreground">{section.description}</div>
              </button>
            ))}
          </div>
        )}

        {showAddMenu && availableSectionsToAdd.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-10 p-4">
            <p className="text-sm text-muted-foreground text-center">
              All available sections have been added
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
