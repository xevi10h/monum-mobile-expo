// Importa los archivos de traducciones

// Configuración de i18next
// (root)/src/lib/i18n.ts
import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import en_US from '@/locales/en_US.json';
import es_ES from '@/locales/es_ES.json';
import ca_ES from '@/locales/ca_ES.json';
import fr_FR from '@/locales/fr_FR.json';
import { Language } from './shared/types/Language';

export const deviceLanguage: Language = getLocales()?.[0]?.languageTag
	? (getLocales()?.[0]?.languageTag.replace('-', '_') as Language)
	: 'ca_ES';

export const i18n = new I18n({
	ca_ES,
	en_US,
	es_ES,
	fr_FR,
});

i18n.defaultLocale = deviceLanguage;

i18n.locale = deviceLanguage;

export function changeLanguage(lang: string) {
	i18n.locale = lang;
}
