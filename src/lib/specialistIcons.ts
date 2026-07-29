import { Heart, Sparkles, Baby, UserCircle, Brain, Wind, Bone, Stethoscope, type LucideIcon } from 'lucide-react';

export const SPECIALIST_ICON: Record<string, LucideIcon> = {
  Cardiología: Heart,
  Dermatología: Sparkles,
  Pediatría: Baby,
  Ginecología: UserCircle,
  Neurología: Brain,
  Neumología: Wind,
  Geriatría: UserCircle,
  Reumatología: Bone,
  'Medicina General / Interna': Stethoscope,
  'Medicina General': Stethoscope,
};

export const FALLBACK_SPECIALIST_ICON = Stethoscope;
