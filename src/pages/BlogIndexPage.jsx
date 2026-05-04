import { Link } from 'react-router-dom';
import Seo, { breadcrumbJsonLd } from '../components/Seo.jsx';
import { POSTS, slugForLang } from '../blog/posts.js';
import useI18n from '../i18n/useI18n.js';

const SITE_URL = 'https://radiolive.ma';

/** Sélectionne le titre/excerpt selon la langue, fallback FR si pas de variante. */
function localized(post, lang) {
  if (lang !== 'ar') return post;
  return {
    ...post,
    title: post.title_ar || post.title,
    excerpt: post.excerpt_ar || post.excerpt,
  };
}

export default function BlogIndexPage() {
  const { lang } = useI18n();
  const isAr = lang === 'ar';
  const arPrefix = isAr ? '/ar' : '';
  const homeHref = isAr ? '/ar' : '/';

  // Tri : plus récent en premier (date desc)
  const sorted = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <article className="pt-6 sm:pt-10 pb-16 max-w-4xl mx-auto">
      <Seo
        lang={lang}
        title={isAr
          ? 'مدونة إذاعات المغرب — أخبار وملفات حول الإذاعات المغربية'
          : 'Blog Radio Maroc — Actualités, dossiers et guides radio marocains'}
        description={isAr
          ? 'المدونة المرجعية للمشهد الإذاعي المغربي: أفضل الإذاعات، التاريخ، أدلة الاستماع، ملفات حول راديو FM والبث عبر الأنترنت في المغرب.'
          : "Le blog dédié au paysage radiophonique marocain : top radios, histoire, guides d'écoute, dossiers thématiques sur les radios FM et le streaming au Maroc."}
        canonical={`${SITE_URL}${arPrefix}/blog`}
        alternates={[
          { hreflang: 'fr-MA', href: `${SITE_URL}/blog` },
          { hreflang: 'ar-MA', href: `${SITE_URL}/ar/blog` },
          { hreflang: 'x-default', href: `${SITE_URL}/blog` },
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: isAr ? 'الرئيسية' : 'Accueil', url: homeHref },
          { name: isAr ? 'المدونة' : 'Blog' },
        ])}
      />

      <Link to={homeHref} className="text-sm text-white/60 hover:text-white">
        {isAr ? '→ العودة إلى الرئيسية' : "← Retour à l'accueil"}
      </Link>

      <h1 className="font-display text-3xl sm:text-5xl font-bold mt-6 mb-4 text-balance">
        {isAr ? 'مدونة' : 'Le blog'}{' '}
        <span className="gradient-text">{isAr ? 'إذاعات المغرب' : 'Radio Maroc'}</span>
      </h1>

      <p className="text-white/75 text-lg leading-relaxed mb-10">
        {isAr
          ? 'كل ما تحتاج لمعرفته عن الإذاعة المغربية في 2026: ترتيبات، أدلة الاستماع، تاريخ المحطات، مقارنات FM / البث عبر الأنترنت، وملفات موضوعاتية حسب النوع الموسيقي والمدينة.'
          : "Tout ce qu'il faut savoir sur la radio marocaine en 2026 : classements, guides d'écoute, histoires des stations, comparatifs FM / streaming et dossiers thématiques par genre musical et par ville."}
      </p>

      <div className="space-y-4">
        {sorted.map((rawPost) => {
          const post = localized(rawPost, lang);
          return (
            <Link
              key={post.slug}
              to={`${arPrefix}/blog/${slugForLang(rawPost, lang)}`}
              className="block glass rounded-3xl p-5 sm:p-6 hover:bg-white/8 transition-colors group"
            >
              <div className="flex items-baseline gap-3 text-[11px] text-white/40 mb-2 uppercase tracking-wider">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString(isAr ? 'ar-MA' : 'fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </time>
                <span>·</span>
                <span>
                  {post.readingTime} {isAr ? 'دقائق قراءة' : 'min de lecture'}
                </span>
              </div>
              <h2 className="font-display font-bold text-xl text-white group-hover:text-[#FF6B7A] transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-white/70">{post.excerpt}</p>
            </Link>
          );
        })}
      </div>
    </article>
  );
}
