'use client';

import { useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import LanguageMenu from './LanguageMenu';

const links = ['personal', 'business'] as const;

export default function Navbar() {
	const t = useTranslations('nav');
	const pathname = usePathname();
	const { resolvedTheme, setTheme } = useTheme();
	const { scrollY } = useScroll();
	const [scrolled, setScrolled] = useState(false);
	useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24));

	const iconBtn =
		'grid h-9 min-w-9 place-items-center rounded-full px-2 text-xs font-semibold uppercase transition hover:bg-fg/10';

	return (
		<motion.header
			initial={{ y: -80, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
			className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6"
		>
			<nav
				className={`mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full border px-2 py-2 transition-all duration-500 sm:px-3 ${
					scrolled
						? 'border-border bg-card/70 shadow-lg shadow-black/5 backdrop-blur-xl'
						: 'border-transparent'
				}`}
			>
				<Link
					href="/"
					className="flex items-center gap-2 pl-1 font-semibold tracking-tight"
				>
					<span className="bg-brand grid h-8 w-8 place-items-center rounded-full text-sm text-white">
						N
					</span>
					<span className="hidden text-lg sm:inline">Nova Bank</span>
				</Link>

				<div className="flex items-center gap-1">
					{links.map((key) => {
						const href = `/${key}`;
						const active = pathname === href;
						return (
							<Link
								key={key}
								href={href}
								className="relative rounded-full px-3 py-2 text-sm font-medium sm:px-4"
							>
								{active && (
									<motion.span
										layoutId="nav-pill"
										className="absolute inset-0 rounded-full bg-fg"
										transition={{
											type: 'spring',
											bounce: 0.25,
											duration: 0.5,
										}}
									/>
								)}
								<span
									className={`relative ${active ? 'text-bg' : ''}`}
								>
									{t(key)}
								</span>
							</Link>
						);
					})}
				</div>

				<div className="flex items-center gap-1">
					<LanguageMenu />
					<button
						type="button"
						className={iconBtn}
						aria-label={t('theme')}
						onClick={() =>
							setTheme(
								resolvedTheme === 'dark' ? 'light' : 'dark',
							)
						}
					>
						{/* CSS picks the icon so server and client render the same markup */}
						<Moon className="h-4 w-4 dark:hidden" />
						<Sun className="hidden h-4 w-4 dark:block" />
					</button>
					<Link
						href="/personal"
						className="hidden rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg transition hover:scale-105 md:inline-block"
					>
						{t('cta')}
					</Link>
				</div>
			</nav>
		</motion.header>
	);
}
