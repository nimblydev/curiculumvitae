export interface ContactInfo {
  phone: string;
  email: string;
  location: string;
  linkedin: string;
  github?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location?: string;
  highlights: string[];
  tags: string[];
}

export interface SkillGroup {
  category: string;
  icon: string;
  skills: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  location?: string;
}

export interface Interest {
  label: string;
  icon: string;
  description?: string;
  easterId?: string;
}

export interface CvData {
  name: string;
  title: string;
  subtitle: string;
  pitch: string;
  contact: ContactInfo;
  experiences: Experience[];
  skillGroups: SkillGroup[];
  education: Education[];
  interests: Interest[];
}
