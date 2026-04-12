'use client';

import { useResumeStore } from '../../../lib/stores/resumeStore';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { toastSuccess } from '../ui/toast-helpers';
import { Paintbrush, Type, Maximize2, Palette, Loader2 } from 'lucide-react';

const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Outfit', value: 'Outfit' },
  { label: 'Open Sans', value: 'Open Sans' },
];

const FONT_SIZE_OPTIONS = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

export default function DesignSettings() {
  const resume = useResumeStore((state) => state.resume);
  const updateSettings = useResumeStore((state) => state.updateSettings);

  const setSaving = useResumeStore((state) => state.setSaving);
  const isSaving = useResumeStore((state) => state.isSaving);

  if (!resume) return null;

  const settings = resume.settings;

  const handleManualSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/resumes/${resume.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || 'Failed to save settings');
      }

      useResumeStore.getState().setDirty(false);
      toastSuccess('Settings Saved', 'Your design customizations have been persisted.');
    } catch (error) {
      import('../ui/toast-helpers').then(({ toastError }) => {
        toastError('Save Failed', error instanceof Error ? error.message : 'Could not save settings');
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full space-y-6 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
        <Paintbrush className="h-5 w-5 text-emerald-600" />
        <h3 className="text-lg font-bold text-slate-900">Design Settings</h3>
      </div>

      {/* Typography */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
          <Type className="h-4 w-4" />
          Typography
        </div>

        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select
            value={settings.fontFamily}
            onChange={(e) => updateSettings({ fontFamily: e.target.value })}
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                {font.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Base Font Size</Label>
          <div className="grid grid-cols-3 gap-2">
            {FONT_SIZE_OPTIONS.map((size) => (
              <Button
                key={size.value}
                variant={settings.fontSize === size.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSettings({ fontSize: size.value as any })}
                className={settings.fontSize === size.value ? 'bg-emerald-600 text-white hover:bg-emerald-700' : ''}
              >
                {size.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-4 border-t border-zinc-100 pt-6">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
          <Palette className="h-4 w-4" />
          Colors
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                className="h-10 w-12 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                className="flex-1 font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                className="h-10 w-12 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                className="flex-1 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-100 flex flex-col gap-4">
        <Button
          disabled={isSaving}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
          onClick={handleManualSave}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Paintbrush className="h-4 w-4" />
          )}
          {isSaving ? 'Saving...' : 'Save Design Settings'}
        </Button>

        <p className="text-[11px] leading-relaxed text-zinc-400 text-center">
          * These settings are applied globally across the resume. Some templates may override specific styles for design fidelity.
        </p>
      </div>
    </div>
  );
}
