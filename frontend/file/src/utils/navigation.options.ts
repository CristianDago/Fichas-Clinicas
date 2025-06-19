import { DropdownOption } from "../interface/utils/utils";

export const generateCourseOptions = (schoolSlug: string): DropdownOption[] => [
  { label: "1° nivel básico", path: `/dashboard/${schoolSlug}/1nb` },
  { label: "2° nivel básico", path: `/dashboard/${schoolSlug}/2nb` },
  { label: "3° nivel básico", path: `/dashboard/${schoolSlug}/3nb` },
  { label: "1° nivel medio", path: `/dashboard/${schoolSlug}/1nm` },
  { label: "2° nivel medio", path: `/dashboard/${schoolSlug}/2nm` },
];
