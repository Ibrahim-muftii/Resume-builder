'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { personalInfoSchema, type PersonalInfoSchemaType } from '../../../lib/validations/resumeSchema';
import type { SectionItem, SectionItemData } from '../../../lib/types/resume';

interface SectionFormProps {
  sectionId: string;
  item: SectionItem;
  onSave: (data: SectionItemData) => void;
  onCancel: () => void;
}

export default function PersonalInfoSection({ item, onSave, onCancel }: SectionFormProps) {
  const defaults: PersonalInfoSchemaType =
    item.type === 'personal_info'
      ? {
          type: 'personal_info',
          fullName: item.data.fullName,
          jobTitle: item.data.jobTitle,
          email: item.data.email,
          phone: item.data.phone,
          location: item.data.location,
          website: item.data.website ?? '',
          linkedin: item.data.linkedin ?? '',
          github: item.data.github ?? '',
          summary: item.data.summary,
          avatarUrl: item.data.avatarUrl ?? '',
        }
      : {
          type: 'personal_info',
          fullName: '',
          jobTitle: '',
          email: '',
          phone: '',
          location: '',
          website: '',
          linkedin: '',
          github: '',
          summary: '',
          avatarUrl: '',
        };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoSchemaType>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: defaults,
  });

  const submit = async (data: PersonalInfoSchemaType): Promise<void> => {
    await Promise.resolve(onSave(data));
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(submit)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="font-semibold text-zinc-800">Full Name</Label>
          <Input id="fullName" placeholder="John Doe" {...register('fullName')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
          {errors.fullName ? <p className="text-xs font-medium text-red-500">{errors.fullName.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobTitle" className="font-semibold text-zinc-800">Job Title</Label>
          <Input id="jobTitle" placeholder="e.g., Senior Developer" {...register('jobTitle')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
          {errors.jobTitle ? <p className="text-xs font-medium text-red-500">{errors.jobTitle.message}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-semibold text-zinc-800">Email</Label>
          <Input id="email" type="email" placeholder="john@example.com" {...register('email')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
          {errors.email ? <p className="text-xs font-medium text-red-500">{errors.email.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="font-semibold text-zinc-800">Phone</Label>
          <Input id="phone" placeholder="+1 (555) 000-0000" {...register('phone')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
          {errors.phone ? <p className="text-xs font-medium text-red-500">{errors.phone.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="font-semibold text-zinc-800">Location</Label>
        <Input id="location" placeholder="San Francisco, CA" {...register('location')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
        {errors.location ? <p className="text-xs font-medium text-red-500">{errors.location.message}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="website" className="font-semibold text-zinc-800">Website</Label>
          <Input id="website" placeholder="https://yoursite.com" {...register('website')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
          {errors.website ? <p className="text-xs font-medium text-red-500">{errors.website.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin" className="font-semibold text-zinc-800">LinkedIn</Label>
          <Input id="linkedin" placeholder="https://linkedin.com/in/yourprofile" {...register('linkedin')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
          {errors.linkedin ? <p className="text-xs font-medium text-red-500">{errors.linkedin.message}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="github" className="font-semibold text-zinc-800">GitHub</Label>
          <Input id="github" placeholder="https://github.com/yourprofile" {...register('github')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
          {errors.github ? <p className="text-xs font-medium text-red-500">{errors.github.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatarUrl" className="font-semibold text-zinc-800">Avatar URL</Label>
          <Input id="avatarUrl" placeholder="https://example.com/avatar.jpg" {...register('avatarUrl')} className="border-zinc-200 bg-zinc-50 focus:bg-white" />
          {errors.avatarUrl ? <p className="text-xs font-medium text-red-500">{errors.avatarUrl.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary" className="font-semibold text-zinc-800">Professional Summary</Label>
        <Textarea id="summary" rows={4} placeholder="Tell us about yourself and your experience..." {...register('summary')} className="border-zinc-200 bg-zinc-50 focus:bg-white resize-none" />
        {errors.summary ? <p className="text-xs font-medium text-red-500">{errors.summary.message}</p> : null}
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
