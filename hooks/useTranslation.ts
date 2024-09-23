// src/hooks/useTranslation.ts
import { useEffect } from 'react';
import { useUserStore } from '@/zustand/UserStore';
import { i18n, changeLanguage } from '@/i18n';

export function useTranslation() {
	const language = useUserStore((state) => state.user.language);

	useEffect(() => {
		changeLanguage(language);
	}, [language]);

	return {
		t: i18n.t.bind(i18n),
		locale: i18n.locale,
	};
}
