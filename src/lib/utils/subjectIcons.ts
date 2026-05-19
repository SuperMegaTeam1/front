import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import SportsSoccerOutlinedIcon from '@mui/icons-material/SportsSoccerOutlined';
import type { SvgIconComponent } from '@mui/icons-material';

type SubjectIconRule = {
  icon: SvgIconComponent;
  keywords: string[];
};

const SUBJECT_ICON_RULES: SubjectIconRule[] = [
  {
    icon: CalculateOutlinedIcon,
    keywords: ['матем', 'алгебр', 'геометр', 'анализ', 'статист', 'теорвер'],
  },
  {
    icon: CodeOutlinedIcon,
    keywords: ['программ', 'алгоритм', 'разработ', 'python', 'java', 'javascript', 'typescript', 'c++'],
  },
  {
    icon: HubOutlinedIcon,
    keywords: ['сеть', 'систем', 'архитектур', 'базы данных', 'информатик'],
  },
  {
    icon: PsychologyOutlinedIcon,
    keywords: ['философ', 'истори', 'социолог', 'психолог', 'культуролог'],
  },
  {
    icon: SportsSoccerOutlinedIcon,
    keywords: ['физкультур', 'спорт', 'офп'],
  },
];

function normalizeSubjectName(name: string) {
  return name
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getSubjectIconByName(name?: string): SvgIconComponent {
  const normalizedName = normalizeSubjectName(name ?? '');

  const matchedRule = SUBJECT_ICON_RULES.find((rule) =>
    rule.keywords.some((keyword) => normalizedName.includes(keyword))
  );

  return matchedRule?.icon ?? MenuBookOutlinedIcon;
}
