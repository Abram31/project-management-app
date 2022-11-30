export const RouteMain = '/project-management-app';

export const ROUTES = {
  signup: RouteMain + '/signup',
  signin: RouteMain + '/signin',
  boards: RouteMain + '/boards',
  edit: RouteMain + '/edit',
};
export const URLS = {
  signup: 'https://react-final-task.herokuapp.com/signup',
  signin: 'https://react-final-task.herokuapp.com/signin',
  boards: 'https://react-final-task.herokuapp.com/boards',
};
export const REGEX = {
  name: /^[a-zA-Zа-яА-Я\-\']{2}[a-zA-Zа-яА-Я \-\']{0,}$/,
  login: /^[a-zA-Z0-9\d@$!%*#?&\-\_]{2,20}$/,
  password: /^(?!.* )(?=.*[A-Za-z])(?=.*\d).{8,20}$/,
};
export const ERROR_TEXT = {
  required: 'This field is required.',
  userName: 'Must be min 2 characters(only letters, apostrophes, hyphens).',
  login: 'Must be 2-20 characters(only latin letters, numbers, special characters, hyphens).',
  password: 'Must be 8-20 characters(least 1 latin letter, 1 number).',
};
export const TOASTIFY_SETTINGS = {
  position: 'bottom-right' as const,
  autoClose: 5000 as const,
  hideProgressBar: true as const,
  newestOnTop: false as const,
  closeOnClick: true as const,
  rtl: false as const,
  pauseOnFocusLoss: true as const,
  draggable: true as const,
  pauseOnHover: true as const,
  theme: 'dark' as const,
};
