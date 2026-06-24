export const USER_PROFILE = {
  skills: ['programming', 'teaching', 'first_aid'] as const,
  neighborhoods: ['tehran-azadi', 'tehran-niavaran'] as const,
};

export const PROFILE_FILTER_DEFAULTS = {
  skills: [...USER_PROFILE.skills],
  neighborhoods: [...USER_PROFILE.neighborhoods],
};
