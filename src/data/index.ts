import { LessonData, ModuleData } from '../types/course';
import { MODULES_1_TO_2 } from './modules1to2';
import { MODULES_3_TO_4 } from './modules3to4';
import { MODULES_5_TO_6 } from './modules5to6';
import { MODULES_7_TO_8 } from './modules7to8';

export { PRACTICE_QUESTIONS, GLOSSARY_CONCEPTS } from './practiceAndGlossary';

export const COURSE_MODULES: ModuleData[] = [
  ...MODULES_1_TO_2,
  ...MODULES_3_TO_4,
  ...MODULES_5_TO_6,
  ...MODULES_7_TO_8
];

export interface FlatLessonEntry {
  module: ModuleData;
  lesson: LessonData;
  lessonIndexInModule: number;
  globalIndex: number;
}

export const FLAT_LESSONS: FlatLessonEntry[] = (() => {
  const list: FlatLessonEntry[] = [];
  let gIdx = 0;
  COURSE_MODULES.forEach((mod) => {
    mod.lessons.forEach((lesson, lIdx) => {
      list.push({
        module: mod,
        lesson,
        lessonIndexInModule: lIdx,
        globalIndex: gIdx++
      });
    });
  });
  return list;
})();
