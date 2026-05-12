import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, ChevronRight } from 'lucide-react';
import Seo, { breadcrumbJsonLd } from '../components/Seo.jsx';
import RadioIcon from '../components/RadioIcon.jsx';
import { POST_BY_SLUG, POST_BY_SLUG_AR, POSTS, slugForLang } from '../blog/posts.js';
import { useAppContext } from '../AppContext.jsx';
import useI18n from '../i18n/useI18n.js';

const SITE_URL = 'https://radiolive.ma';

/**
 * Bascule un post entre FR (par défaut) et AR (champs *_ar si présents).
 * Si le post n'a pas de variante AR, garde le FR comme fallback.
 */
function localized(post, lang) {
  if (lang !== 'ar' || !post.body_ar) return post;
  return {
    ...post,
    title: post.title_ar || post.title,
    excerpt: post.excerpt_ar || post.excerpt,
    body: post.body_ar,
    keywords: post.keywords_ar || post.keywords,
  };
}

const articleJsonLd = (post, lang) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  datePublished: post.date,
  dateModified: post.dateModified || post.date,
  description: post.excerpt,
  inLanguage: lang === 'ar' ? 'ar-MA' : 'fr-MA',
  author: { '@type': 'Organization', name: lang === 'ar' ? 'إذاعات المغرب' : 'Radio Maroc' },
  publisher: {
    '@type': 'Organization',
    name: lang === 'ar' ? 'إذاعات المغرب' : 'Radio Maroc',
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${SITE_URL}${lang === 'ar' ? '/ar' : ''}/blog/${post.slug}`,
  },
  articleSection: post.tags?.[0] || 'Music',
  keywords: post.keywords?.join(', '),
  ...(post.heroImage ? { image: `${SITE_URL}${post.heroImage}` } : {}),
});

function renderBlock(block, i) {
  switch (block.type) {
    case 'p':
      return (
        <p key={i} className="mb-5 leading-relaxed">
          {block.kids.map((kid, j) =>
            typeof kid === 'string' ? (
              <span key={j}>{kid}</span>
            ) : kid.type === 'b' ? (
              <strong key={j}>{kid.text}</strong>
            ) : kid.type === 'link' ? (
              <Link key={j} to={kid.to} className="text-[#FF6B7A] hover:underline">
                {kid.text}
              </Link>
            ) : null
          )}
        </p>
      );
    case 'h2':
      return (
        <h2 key={i} className="font-display text-2xl font-bold text-white mt-10 mb-4">
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 key={i} className="font-display text-lg font-semibold text-white mt-6 mb-3">
          {block.text}
        </h3>
      );
    case 'ul':
      return (
        <ul key={i} className="list-disc pl-6 rtl:pr-6 rtl:pl-0 mb-5 space-y-2 marker:text-[#FF2A3C]">
          {block.items.map((it, j) => <li key={j}>{it}</li>)}
        </ul>
      );
    default:
      return null;
  }
}

/**
 * CTA "Stations à écouter" — 3 stations associées à l'article (champ
 * relatedStations dans posts.js, pointe vers les ids slugifiés).
 */
function StationsCTA({ stationIds, lang }) {
  const { radios, playRadio } = useAppContext();
  const arPrefix = lang === 'ar' ? '/ar' : '';

  const stations = useMemo(() => {
    if (!stationIds?.length || !radios?.length) return [];
    const map = new Map(radios.map((r) => [r.id, r]));
    return stationIds.map((id) => map.get(id)).filter(Boolean).slice(0, 3);
  }, [stationIds, radios]);

  if (!stations.length) return null;

  return (
    <section className="mt-12 glass rounded-3xl p-6">
      <h2 className="font-display text-xl font-bold mb-1">
        {lang === 'ar' ? 'استمع إلى الإذاعات المرتبطة' : 'Stations à écouter'}
      </h2>
      <p className="text-sm text-white/60 mb-5">
        {lang === 'ar'
          ? 'اكتشف الموسيقى المذكورة في هذا المقال مباشرة'
          : 'Découvrez la musique évoquée dans cet article en direct'}
      </p>
      <div className="grid sm:grid-cols-3 gap-3">
        {stations.map((r) => (
          <div key={r.id} className="flex items-center gap-3 glass rounded-2xl p-3">
            <RadioIcon radio={r} size="sm" />
            <div className="flex-1 min-w-0">
              <Link
                to={`${arPrefix}/station/${r.id}`}
                className="font-semibold text-sm text-white hover:text-[#FF6B7A] truncate block"
              >
                {r.name}
              </Link>
              <button
                onClick={() => playRadio(r)}
                className="inline-flex items-center gap-1 text-[11px] text-[#FF6B7A] hover:text-[#FF2A3C] transition mt-0.5"
              >
                <Play className="h-3 w-3" />
                {lang === 'ar' ? 'استمع' : 'Écouter'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const { t, lang } = useI18n();
  // En AR, on essaye d'abord l'index AR (slug translittéré ex.
  // 'al-musiqa-al-chaabia-al-maghribiya'), sinon fallback sur le slug FR.
  const rawPost =
    lang === 'ar'
      ? (POST_BY_SLUG_AR[slug] || POST_BY_SLUG[slug])
      : POST_BY_SLUG[slug];
  const post = rawPost ? localized(rawPost, lang) : null;

  useEffect(() => { window.scrollTo({ top: 0 }); }, [slug]);

  // ─── ALL HOOKS BEFORE EARLY RETURN (Rules of Hooks) ───
  // Articles liés via slugs explicites OU partage de tags
  const related = useMemo(() => {
    if (!rawPost) return [];
    const explicit = (rawPost.relatedArticles || [])
      .map((s) => POST_BY_SLUG[s])
      .filter(Boolean);
    if (explicit.length >= 3) return explicit.slice(0, 3);
    const byTag = POSTS.filter(
      (p) =>
        p.slug !== rawPost.slug &&
        !explicit.some((e) => e.slug === p.slug) &&
        rawPost.tags?.some((tag) => p.tags?.includes(tag))
    );
    return [...explicit, ...byTag].slice(0, 3);
  }, [rawPost]);

  if (!post) {
    return (
      <div className="py-20 max-w-md mx-auto text-center">
        <Seo title={lang === 'ar' ? 'المقال غير موجود' : 'Article introuvable'} noindex />
        <h2 className="font-display text-2xl font-bold mb-2">
          {lang === 'ar' ? 'المقال غير موجود' : 'Article introuvable'}
        </h2>
        <Link to={lang === 'ar' ? '/ar/blog' : '/blog'} className="btn-primary inline-flex">
          {lang === 'ar' ? 'كل المقالات' : 'Voir tous les articles'}
        </Link>
      </div>
    );
  }

  const arPrefix = lang === 'ar' ? '/ar' : '';
  const blogHref = `${arPrefix}/blog`;
  // Slugs distincts FR/AR — utilisés pour canonical + hreflang siblings
  const frSlug = rawPost.slug;
  const arSlug = rawPost.slug_ar || rawPost.slug;
  const canonical = `${SITE_URL}${arPrefix}/blog/${lang === 'ar' ? arSlug : frSlug}`;
  const frHref = `${SITE_URL}/blog/${frSlug}`;
  const arHref = `${SITE_URL}/ar/blog/${arSlug}`;

  return (
    <article className="pt-6 sm:pt-10 pb-16 max-w-3xl mx-auto">
      <Seo
        lang={lang}
        title={post.title}
        description={post.excerpt}
        type="article"
        canonical={canonical}
        alternates={[
          { hreflang: 'fr-MA', href: frHref },
          { hreflang: 'ar-MA', href: arHref },
          { hreflang: 'x-default', href: frHref },
        ]}
        jsonLd={[
          articleJsonLd({ ...post, slug: rawPost.slug }, lang),
          breadcrumbJsonLd([
            { name: lang === 'ar' ? 'الرئيسية' : 'Accueil', url: arPrefix || '/' },
            { name: lang === 'ar' ? 'المدونة' : 'Blog', url: blogHref },
            { name: post.title },
          ]),
        ]}
      />

      <Link to={blogHref} className="text-sm text-white/60 hover:text-white">
        {lang === 'ar' ? '→ كل المقالات' : '← Tous les articles'}
      </Link>

      <header className="mt-6 mb-10">
        <div className="flex items-center gap-3 text-[11px] text-white/40 uppercase tracking-wider mb-3">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </time>
          <span>·</span>
          <span>
            {post.readingTime} {lang === 'ar' ? 'دقيقة' : 'min'}
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-balance leading-tight">
          {post.title}
        </h1>
        <p className="text-lg text-white/75 mt-4 leading-relaxed">{post.excerpt}</p>
      </header>

      <div className="text-white/85 text-[15.5px]">
        {post.body.map(renderBlock)}
      </div>

      <StationsCTA stationIds={rawPost.relatedStations} lang={lang} />

      {related.length > 0 && (
        <section className="mt-12 pt-10 border-t border-white/10">
          <h2 className="font-display text-xl font-semibold mb-5">
            {lang === 'ar' ? 'مقالات مرتبطة' : 'Articles liés'}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((p) => {
              const localizedP = localized(p, lang);
              return (
                <Link
                  key={p.slug}
                  to={`${arPrefix}/blog/${slugForLang(p, lang)}`}
                  className="glass rounded-2xl p-4 hover:bg-white/8 transition-colors group"
                >
                  <p className="text-[11px] sm:text-[10px] uppercase tracking-wider text-white/40 mb-2">
                    {new Date(p.date).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', {
                      day: 'numeric', month: 'short',
                    })}
                  </p>
                  <p className="font-display font-semibold text-sm leading-tight line-clamp-3 group-hover:text-[#FF6B7A] transition">
                    {localizedP.title}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-3 text-xs text-white/55 group-hover:text-[#FF6B7A] transition">
                    {lang === 'ar' ? 'اقرأ' : 'Lire'} <ChevronRight className="h-3 w-3 rtl:rotate-180" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
