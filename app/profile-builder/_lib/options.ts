type Option = {
  value: string;
  label: string;
};

type MajorCategory = {
  label: string;
  departments: {
    label: string;
    majors: string[];
  }[];
};

export const getYearOptions = (): Option[] =>
  Array.from({ length: 24 }, (_, index) => ({
    value: String(1997 + index),
    label: `${1997 + index}년`,
  }));

export const getUniversityOptions = (universities: string[]): Option[] =>
  universities.map((university) => ({
    value: university,
    label: university,
  }));

export const getDepartmentOptions = (
  selectedUniversity: string,
  categories: MajorCategory[],
): Option[] => {
  const university = categories.find(
    (category) => category.label === selectedUniversity,
  );

  if (!university) {
    return [];
  }

  return university.departments.map((department) => ({
    value: department.label,
    label: department.label,
  }));
};

export const getMajorOptions = (
  selectedUniversity: string,
  selectedDepartment: string,
  categories: MajorCategory[],
): Option[] => {
  const university = categories.find(
    (category) => category.label === selectedUniversity,
  );

  if (!university) {
    return [];
  }

  const department = university.departments.find(
    (item) => item.label === selectedDepartment,
  );

  if (!department) {
    return [];
  }

  return department.majors.map((major) => ({
    value: major,
    label: major,
  }));
};
