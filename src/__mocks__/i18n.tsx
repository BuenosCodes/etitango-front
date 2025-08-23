export const mockI18n = {
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
  I18nextProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}; 