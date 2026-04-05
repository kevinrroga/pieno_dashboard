export type Locale = 'en' | 'sq';

export const translations = {
  en: {
    locale: 'en-GB',
    nav: {
      dashboard:     'Dashboard',
      weeklySchedule:'Weekly Schedule',
      employees:     'Employees',
      lightMode:     'Light mode',
      darkMode:      'Dark mode',
      switchLang:    'Shqip',
    },
    schedule: {
      title:   'Weekly Schedule',
      staff:   'Staff',
      today:   'Today',
      kitchen: 'Kitchen (Cooks)',
      front:   'Front (Waiters)',
      cook:    'Cook',
      waiter:  'Waiter',
      days:    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    chart: {
      noShifts: 'No scheduled shifts this week.',
      hours:    'Hours',
    },
  },
  sq: {
    locale: 'sq-AL',
    nav: {
      dashboard:     'Paneli',
      weeklySchedule:'Orari Javor',
      employees:     'Punonjësit',
      lightMode:     'Ndriçim',
      darkMode:      'Errësirë',
      switchLang:    'English',
    },
    schedule: {
      title:   'Orari Javor',
      staff:   'Stafi',
      today:   'Sot',
      kitchen: 'Kuzhina (Kuzhinierët)',
      front:   'Salla (Kamarierët)',
      cook:    'Kuzhinier',
      waiter:  'Kamarier',
      days:    ['Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht', 'Die'],
    },
    chart: {
      noShifts: 'Nuk ka turne të planifikuara këtë javë.',
      hours:    'Orë',
    },
  },
} as const;
