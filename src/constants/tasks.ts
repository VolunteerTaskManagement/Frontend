import { PROFILE_FILTER_DEFAULTS } from './profile';
import type { FilterOption, Task, TaskFilters } from '../types/task';

export const DEFAULT_TASK_FILTERS: TaskFilters = {
  search: '',
  skills: PROFILE_FILTER_DEFAULTS.skills,
  neighborhoods: PROFILE_FILTER_DEFAULTS.neighborhoods,
};

export const SKILL_OPTIONS: FilterOption[] = [
  { value: 'programming', label: 'برنامه‌نویسی' },
  { value: 'teaching', label: 'تدریس' },
  { value: 'first_aid', label: 'کمک‌های اولیه' },
  { value: 'logistics', label: 'لجستیک' },
  { value: 'cooking', label: 'آشپزی' },
];

export const NEIGHBORHOOD_OPTIONS: FilterOption[] = [
  { value: 'tehran-azadi', label: 'تهران - میدان آزادی' },
  { value: 'tehran-niavaran', label: 'تهران - نیاوران' },
  { value: 'tehran-tajrish', label: 'تهران - تجریش' },
  { value: 'tehran-punak', label: 'تهران - پونک' },
  { value: 'tehran-shahrak-gharb', label: 'تهران - شهرک غرب' },
  { value: 'tehran-jamaran', label: 'تهران - جماران' },
];

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'آموزش برنامه‌نویسی پایه به نوجوانان',
    creatorName: 'سارا محمدی',
    description:
      'در این وظیفه به نوجوانان ۱۴ تا ۱۸ سال مفاهیم پایه برنامه‌نویسی و حل مسئله آموزش داده می‌شود. تجربه کار با گروه و صبر کافی نیاز است.',
    address: 'تهران، میدان آزادی، خیابان آزادی، پلاک ۱۲، طبقه دوم',
    creatorPhone: '۰۹۱۲۱۲۳۴۵۶۷',
    imageUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    skills: ['programming', 'teaching'],
    neighborhood: 'tehran-azadi',
    schedule: 'شنبه ۱۸ خرداد · ۱۰:۰۰-۱۳:۰۰',
    vacancies: 3,
  },
  {
    id: '2',
    title: 'کمک در رویداد فستیوال محیط زیست',
    creatorName: 'علی رضایی',
    description:
      'نیاز به داوطلب برای راهنمایی بازدیدکنندگان، توزیع بسته‌های آموزشی و همکاری در ایستگاه‌های کمک‌های اولیه داریم.',
    address: 'تهران، نیاوران، خیابان شهید باهنر، بوستان نیاوران',
    creatorPhone: '۰۹۳۵۹۸۷۶۵۴۳',
    imageUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    skills: ['first_aid'],
    neighborhood: 'tehran-niavaran',
    schedule: 'یکشنبه ۱۹ خرداد · ۰۸:۰۰-۱۶:۰۰',
    vacancies: 5,
  },
  {
    id: '3',
    title: 'توزیع بسته‌های غذایی در محله',
    creatorName: 'مریم حسینی',
    description:
      'بسته‌های غذایی آماده شده و باید بین خانواده‌های نیازمند محله توزیع شود. حمل بسته‌ها با هماهنگی قبلی انجام می‌شود.',
    address: 'تهران، پونک، خیابان میرزابابایی، مجموعه فرهنگی محله',
    creatorPhone: '۰۹۱۹۸۷۶۵۴۳۲',
    imageUrl:
      'https://images.unsplash.com/photo-1488523785073-6b0f1652f08e?w=800&q=80',
    skills: ['logistics'],
    neighborhood: 'tehran-punak',
    schedule: 'دوشنبه ۲۰ خرداد · ۱۴:۰۰-۱۸:۰۰',
    vacancies: 8,
  },
  {
    id: '4',
    title: 'کلاس آموزشی کمک‌های اولیه',
    creatorName: 'رضا کریمی',
    description:
      'برگزاری کارگاه عملی کمک‌های اولیه برای داوطلبان تازه‌وارد. آشنایی با مفاهیم پایه کافی است و جزوه آموزشی ارائه می‌شود.',
    address: 'تهران، میدان انقلاب، خیابان کارگر شمالی، سالن اجتماعات',
    creatorPhone: '۰۹۳۳۱۲۳۴۵۶۷',
    imageUrl:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    skills: ['first_aid', 'teaching'],
    neighborhood: 'tehran-tajrish',
    schedule: 'چهارشنبه ۲۲ خرداد · ۰۹:۰۰-۱۲:۰۰',
    vacancies: 2,
  },
];
