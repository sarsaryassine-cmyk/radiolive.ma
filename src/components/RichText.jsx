import { Link } from 'react-router-dom';

/**
 * Rendu d'un corps d'article au format « blocs » (mêmes helpers que le blog
 * et /info) : p / h2 / h3 / ul, avec inline string | b(text) | lnk(text, to).
 * Composant pur, réutilisable pour le blog comme pour l'actualité.
 */
function renderInline(kid, j) {
  if (typeof kid === 'string') return <span key={j}>{kid}</span>;
  if (kid.type === 'b') return <strong key={j}>{kid.text}</strong>;
  if (kid.type === 'link') {
    const internal = kid.to && kid.to.startsWith('/');
    return internal ? (
      <Link key={j} to={kid.to} className="text-[#FF6B7A] hover:underline">{kid.text}</Link>
    ) : (
      <a key={j} href={kid.to} target="_blank" rel="noopener noreferrer" className="text-[#FF6B7A] hover:underline">
        {kid.text}
      </a>
    );
  }
  return null;
}

function renderBlock(block, i) {
  switch (block.type) {
    case 'h2':
      return <h2 key={i} className="font-display text-2xl font-bold mt-10 mb-4 text-white">{block.text}</h2>;
    case 'h3':
      return <h3 key={i} className="font-display text-xl font-semibold mt-8 mb-3 text-white">{block.text}</h3>;
    case 'ul':
      return (
        <ul key={i} className="mb-6 space-y-2 list-disc list-inside text-white/80">
          {block.items.map((it, j) => <li key={j}>{it}</li>)}
        </ul>
      );
    case 'p':
    default:
      return (
        <p key={i} className="mb-5 leading-relaxed text-white/80">
          {block.kids.map(renderInline)}
        </p>
      );
  }
}

export default function RichText({ blocks = [] }) {
  return <>{blocks.map(renderBlock)}</>;
}
