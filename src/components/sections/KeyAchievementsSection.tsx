'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { keyAchievementSchema, type KeyAchievementSchemaType } from '../../../lib/validations/resumeSchema';
import type { SectionItem, SectionItemData } from '../../../lib/types/resume';

interface SectionFormProps {
  sectionId: string;
  item: SectionItem;
  onSave: (data: SectionItemData) => void;
  onCancel: () => void;
}

export default function KeyAchievementsSection({ item, onSave, onCancel }: SectionFormProps) {
  const defaults: KeyAchievementSchemaType =
    item.type === 'key_achievements'
      ? {
          type: 'key_achievements',
          title: item.data.title,
          description: item.data.description,
        }
      : {
          type: 'key_achievements',
          title: '',
          description: '',
        };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<KeyAchievementSchemaType>({
    resolver: zodResolver(keyAchievementSchema) as any,
    defaultValues: defaults as any,
  });

  const submit = async (data: KeyAchievementSchemaType): Promise<void> => {
    await Promise.resolve(onSave(data));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(submit)}>
      <div className="space-y-2">
        <Label htmlFor="title" className="font-semibold text-zinc-800">Achievement Title</Label>
        <Input
          id="title"
          placeholder="e.g., Awarded Employee of the Year"
          {...register('title')}
          className="border-zinc-200 bg-zinc-50 focus:bg-white"
        />
        {errors.title ? <p className="text-xs font-medium text-red-500">{errors.title.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-semibold text-zinc-800">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your achievement in detail..."
          rows={4}
          {...register('description')}
          className="border-zinc-200 bg-zinc-50 focus:bg-white resize-none"
        />
        {errors.description ? <p className="text-xs font-medium text-red-500">{errors.description.message}</p> : null}
      </div>

      <div className="flex flex-col gap-2 border-t border-zinc-200 pt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="w-full">
          Cancel
        </Button>
      </div>
    </form>
  );
}
