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
    <form className="space-y-4" onSubmit={handleSubmit(submit)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" {...register('fullName')} />
          {errors.fullName ? <p className="text-sm text-red-500">{errors.fullName.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input id="jobTitle" {...register('jobTitle')} />
          {errors.jobTitle ? <p className="text-sm text-red-500">{errors.jobTitle.message}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email ? <p className="text-sm text-red-500">{errors.email.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register('phone')} />
          {errors.phone ? <p className="text-sm text-red-500">{errors.phone.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" {...register('location')} />
        {errors.location ? <p className="text-sm text-red-500">{errors.location.message}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" {...register('website')} />
          {errors.website ? <p className="text-sm text-red-500">{errors.website.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" {...register('linkedin')} />
          {errors.linkedin ? <p className="text-sm text-red-500">{errors.linkedin.message}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <Input id="github" {...register('github')} />
          {errors.github ? <p className="text-sm text-red-500">{errors.github.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatarUrl">Avatar URL</Label>
          <Input id="avatarUrl" {...register('avatarUrl')} />
          {errors.avatarUrl ? <p className="text-sm text-red-500">{errors.avatarUrl.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" rows={3} {...register('summary')} />
        {errors.summary ? <p className="text-sm text-red-500">{errors.summary.message}</p> : null}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
