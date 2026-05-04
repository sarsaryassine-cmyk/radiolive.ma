import { Link } from 'react-router-dom';
import { ChevronRight, Mic2 } from 'lucide-react';

import Seo, { breadcrumbJsonLd, organizationJsonLd } from '../components/Seo.jsx';
import useI18n from '../i18n/useI18n.js';
import { EMISSIONS, EMISSION_KEYS } from '../data/emissions.js';

const SITE_URL = 'https://radiolive.ma';

/**
 * Page d'index des émissions phares — liste toutes les pages éditoriales
 * dédiées aux animateurs et programmes radio. Cible le keyword générique
 * "émissions radios marocaines" / "برامج الإذاعات المغربية" et sert de hub
 * de découverte interne (maillage SEO + navigation utilisateur).
 *
 * Chaque card pointe vers la page dédiée d'une émission (Mamoun Dribi, etc.).
 */
export default function EmissionsIndexPage() {
  const { lang } = useI18n();
  const isAr = lang === 'ar';
  const homeHref = isAr ? '/ar' : '/';
  const canonical = `${SITE_URL}${isAr ? '/ar/baramij' : '/emissions'}`;
  const frHref = `${SITE_URL}/emissions`;
  const arHref = `${SITE_URL}/ar/baramij`;

  const title = isAr
    ? 'برامج الإذاعات المغربية — مأمون دريبي والبرامج الشعبية'
    : 'Émissions des radios marocaines — Mamoun Dribi & programmes phares';
  const description = isAr
    ? 'كل البرامج الإذاعية المغربية الأكثر استماعا: مأمون مبارك دريبي على ميد راديو، البرامج الرياضية، الدينية والثقافية. مواعيد البث والاستماع المباشر مجانا.'
    : "Toutes les émissions de radios marocaines les plus écoutées : Mamoun Moubarak Dribi sur Med Radio, programmes sportifs, religieux et culturels. Horaires et écoute en direct gratuite.";

  const breadcrumb = breadcrumbJsonLd([
    { name: isAr ? 'الرئيسية' : 'Accueil', url: `${SITE_URL}${homeHref}` },
    { name: isAr ? 'البرامج' : 'Émissions', url: canonical },
  ]);

  return (
    <>
      <Seo
        lang={lang}
        title={title}
        description={description}
        canonical={canonical}
        alternates={[
          { hreflang: 'fr-MA', href: frHref },
          { hreflang: 'ar-MA', href: arHref },
          { hreflang: 'x-default', href: frHref },
        ]}
        jsonLd={[breadcrumb, organizationJsonLd(lang)]}
      />

      <nav className="text-[11px] sm:text-[10px] text-white/55 mt-2 mb-6 flex items-center gap-1.5">
        <Link to={homeHref} className="hover:text-white transition">
          {isAr ? 'الرئيسية' : 'Accueil'}
        </Link>
        <ChevronRight className="h-3 w-3 rtl:rotate-180" />
        <span className="text-white/85">{isAr ? 'البرامج' : 'Émissions'}</span>
      </nav>

      <header className="max-w-3xl mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-11 w-11 rounded-2xl glass flex items-center justify-center">
            <Mic2 className="h-5 w-5 text-[#FF6B7A]" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-balance">
            {isAr ? 'برامج الإذاعات المغربية' : 'Émissions des radios marocaines'}
          </h1>
        </div>
        <p className="text-sm text-white/70 leading-relaxed">
          {isAr
            ? 'دليل شامل لأشهر البرامج الإذاعية في المغرب: تقديم لكل برنامج، السيرة الذاتية للمنشطين، مواعيد البث، وروابط للاستماع المباشر إلى المحطة.'
            : "Le guide complet des grandes émissions des radios marocaines : présentation de chaque programme, biographie des animateurs, horaires de diffusion, et lien direct vers l'écoute en direct de la station."}
        </p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EMISSION_KEYS.map((key) => {
          const e = EMISSIONS[key];
          const c = isAr ? e.ar : e.fr;
          const path = isAr ? e.ar_path : e.fr_path;
          const stationName = isAr ? e.station_name_ar : e.station_name;
          return (
            <Link
              key={e.slug}
              to={path}
              className="glass rounded-2xl p-5 hover:bg-white/8 transition-colors group"
            >
              <p className="text-[11px] sm:text-[10px] uppercase tracking-wider text-[#FF6B7A] mb-2">
                {isAr ? 'برنامج' : 'Émission'} · {stationName}
              </p>
              <h2 className="font-display font-semibold text-base leading-tight mb-2 line-clamp-2 group-hover:text-[#FF6B7A] transition">
                {c.h1}
              </h2>
              <p className="text-xs text-white/55 line-clamp-3 leading-relaxed">
                {c.description}
              </p>
            </Link>
          );
        })}
      </section>

      <section className="mt-12 max-w-3xl text-white/75 leading-relaxed">
        <h2 className="font-display text-xl font-semibold text-white mb-3">
          {isAr ? 'لماذا هذه البرامج هي الأكثر استماعا؟' : 'Pourquoi ces émissions sont les plus écoutées ?'}
        </h2>
        <p className="text-sm">
          {isAr
            ? 'تجمع البرامج الإذاعية المغربية الكبرى بين القرب من المستمع، الجودة التحريرية، وقدرة منشطيها على معالجة مواضيع المجتمع المغربي بلغة قريبة. من برامج الإستشارة النفسية إلى البرامج الدينية، الرياضية والشعبية، تشكل هذه البرامج علامات في الذاكرة الجماعية للمغاربة في الداخل وفي المهجر.'
            : "Les grandes émissions des radios marocaines combinent proximité avec l'auditeur, qualité éditoriale et capacité de leurs animateurs à traiter les sujets de société marocaine dans une langue familière. Des émissions de conseil psychologique aux programmes religieux, sportifs et populaires, elles marquent la mémoire collective des Marocains au pays comme dans la diaspora."}
        </p>
      </section>
    </>
  );
}
