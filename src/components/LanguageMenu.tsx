'use client';

import { useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

// Each language in its own tongue, e.g. "English", "Italiano"
const nativeName = (l: string) => {
	const name = new Intl.DisplayNames([l], { type: 'language' }).of(l) ?? l;
	return name.charAt(0).toUpperCase() + name.slice(1);
};

export default function LanguageMenu() {
	const t = useTranslations('nav');
	const locale = useLocale();
	const pathname = usePathname();
	const router = useRouter();
	const [, startTransition] = useTransition();
	const [open, setOpen] = useState(false);

	const select = (l: string) => {
		setOpen(false);
		if (l !== locale) startTransition(() => router.replace(pathname, { locale: l }));
	};

	return (
		<div
			className="relative"
			// Hover opens on mouse; touch and keyboard use the button click
			onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
			onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
			onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
			onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
		>
			<button
				type="button"
				aria-label={t('language')}
				aria-haspopup="menu"
				aria-expanded={open}
				onClick={() => setOpen((o) => !o)}
				className="flex h-9 items-center gap-1 rounded-full px-2 text-xs font-semibold uppercase transition hover:bg-fg/10"
			>
				<Globe className="h-4 w-4" />
				{locale}
				<ChevronDown className={`h-3 w-3 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
			</button>

			<AnimatePresence>
				{open && (
					// pt-2 bridges the gap so the pointer can travel from button to menu without closing it
					<motion.div
						initial={{ opacity: 0, y: -8, scale: 0.96 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -8, scale: 0.96 }}
						transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
						className="absolute top-full right-0 origin-top-right pt-2"
					>
						<ul
							role="menu"
							className="min-w-40 rounded-2xl border border-border bg-card/90 p-1.5 shadow-xl shadow-black/10 backdrop-blur-xl"
						>
							{routing.locales.map((l) => (
								<li key={l} role="none">
									<button
										type="button"
										role="menuitemradio"
										aria-checked={l === locale}
										lang={l}
										onClick={() => select(l)}
										className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-fg/5 ${
											l === locale ? 'font-semibold' : 'text-muted hover:text-fg'
										}`}
									>
										<span className="flex items-center gap-2">
											<span className="w-5 text-xs font-semibold uppercase opacity-60">{l}</span>
											{nativeName(l)}
										</span>
										{l === locale && <Check className="h-4 w-4 text-accent" />}
									</button>
								</li>
							))}
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
