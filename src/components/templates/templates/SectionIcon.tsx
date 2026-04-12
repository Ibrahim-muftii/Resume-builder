import {
  Briefcase,
  GraduationCap,
  Sparkles,
  FolderKanban,
  BadgeCheck,
  Languages,
  Trophy,
  PenTool,
  User,
  type LucideIcon
} from 'lucide-react';
import type { SectionType } from '../../../../lib/types/resume';

const iconMap: Record<string, LucideIcon> = {
  personal_info: User,
  experience: Briefcase,
  education: GraduationCap,
  skills: Sparkles,
  projects: FolderKanban,
  certifications: BadgeCheck,
  languages: Languages,
  key_achievements: Trophy,
  custom: PenTool,
};

interface SectionIconProps {
  type: SectionType | string;
  className?: string;
  style?: React.CSSProperties;
}

export function SectionIcon({ type, className, style }: SectionIconProps) {
  const Icon = iconMap[type] || PenTool;
  return <Icon className={className} style={style} />;
}
