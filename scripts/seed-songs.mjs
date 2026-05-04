/**
 * Seed sample song histories for every station that doesn't already have one.
 * Run once with: `node scripts/seed-songs.mjs`
 *
 * After this, the Python/Node ICY scraper takes over to update files in real
 * time on the server. For radios where ICY metadata isn't exposed (HLS,
 * coranic, talk radio) the seed acts as the permanent placeholder.
 */
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const HISTORY_DIR = resolve(ROOT, 'public/songs/history');

// Curated track pool by music style — picked at random when seeding stations.
// Real Moroccan / Arab artists 2024-2026 vintage.
const POOLS = {
  pop_jeune: [
    { artist: 'ElGrande Toto', title: 'Mghayra' },
    { artist: 'ElGrande Toto', title: 'Caviar' },
    { artist: 'Saad Lamjarred', title: 'Casablanca' },
    { artist: 'Saad Lamjarred', title: 'Lm3allem' },
    { artist: 'Hatim Ammor', title: 'Ghalban' },
    { artist: 'Hatim Ammor', title: 'Ana Maghrebi' },
    { artist: 'Manal BK', title: 'Niya' },
    { artist: 'Manal BK', title: 'Slay' },
    { artist: 'Stormy', title: 'Casablanca' },
    { artist: '7liwa', title: 'Hayda' },
    { artist: 'Khtek', title: 'Kick Off' },
    { artist: 'Inkonnu', title: 'Magic' },
    { artist: 'Issam', title: 'Trap Beldi' },
    { artist: 'Don Bigg', title: 'Bladi' },
    { artist: 'Ahmed Chawki', title: 'Habibi I Love You' },
    { artist: 'Dua Lipa', title: 'Houdini' },
    { artist: 'The Weeknd', title: 'Blinding Lights' },
    { artist: 'Billie Eilish', title: 'Birds of a Feather' },
    { artist: 'Taylor Swift', title: 'Cruel Summer' },
    { artist: 'Bruno Mars', title: 'Die With A Smile' },
  ],
  variete_arabe: [
    { artist: 'Nancy Ajram', title: 'Sah Sah' },
    { artist: 'Nancy Ajram', title: 'Salamat' },
    { artist: 'Tamer Hosny', title: 'Aatherny' },
    { artist: 'Tamer Hosny', title: 'Yana Yamoot' },
    { artist: 'Amr Diab', title: 'Tamally Maak' },
    { artist: 'Amr Diab', title: 'Alf Leila Wa Leila' },
    { artist: 'Wael Kfoury', title: 'Tabki El Toyour' },
    { artist: 'Wael Kfoury', title: 'Yamma Mwel El Hawa' },
    { artist: 'Elissa', title: 'Aaks Elli Shayfenha' },
    { artist: 'Sherine', title: 'Mashy Haddi' },
    { artist: 'Mohamed Hamaki', title: 'Ahla Haga Feki' },
    { artist: 'Najwa Karam', title: 'Hayda Haki' },
    { artist: 'Ragheb Alama', title: "Mawjou'a" },
    { artist: 'Carole Samaha', title: 'Wahdy' },
    { artist: 'Asma Lmnawar', title: 'Helmi' },
    { artist: 'Asma Lmnawar', title: 'Mawla' },
    { artist: 'Latifa Raafat', title: 'Mawal Hbibi' },
    { artist: 'Naima Samih', title: 'Yak Aji' },
  ],
  chaabi: [
    { artist: 'Stati', title: 'Doukha Mzyana' },
    { artist: 'Stati', title: 'Ya Lalla' },
    { artist: 'Daoudi', title: 'Khalouni Nbki' },
    { artist: 'Daoudi', title: 'Wash Smahti Lia' },
    { artist: 'Najat Aâtabou', title: 'Hadi El Kelma' },
    { artist: 'Najat Aâtabou', title: 'Lala Yamna' },
    { artist: 'Senhaji', title: 'Galbi Wlfek' },
    { artist: 'Said Senhaji', title: 'Mahdouma' },
    { artist: 'Khalid Bennani', title: 'Maghraba Tal Mout' },
    { artist: 'Salah El Ouadie', title: 'Cha3bi' },
  ],
  rai: [
    { artist: 'Cheb Khaled', title: 'Aïcha' },
    { artist: 'Cheb Khaled', title: 'Didi' },
    { artist: 'Cheb Mami', title: 'Parisien du Nord' },
    { artist: 'Cheb Hasni', title: 'El Bareh' },
    { artist: 'Cheba Zahouania', title: 'Galbi' },
    { artist: 'Cheba Maria', title: 'Maktoub Aalik' },
    { artist: 'Faudel', title: 'Tellement N\'Brick' },
    { artist: 'Cheb Bilal', title: 'Bilal Story' },
  ],
  amazigh: [
    { artist: 'Fatima Tabaamrant', title: 'Tamatart Inu' },
    { artist: 'Cherifa Kersit', title: 'Ayuy Aman' },
    { artist: 'Imanaren', title: 'Tamurt' },
    { artist: 'Raïs Hassan Arsmouk', title: 'Tisniwin' },
    { artist: 'Raïs Demsiri', title: 'Anflus' },
    { artist: 'Najat Aâtabou', title: 'Lala Yamna' },
  ],
  tarab: [
    { artist: 'Oum Kalthoum', title: 'Enta Omri' },
    { artist: 'Oum Kalthoum', title: 'Al Atlal' },
    { artist: 'Mohamed Abdel Wahab', title: 'Cleopatra' },
    { artist: 'Fairouz', title: 'Habaytak Bissayf' },
    { artist: 'Fairouz', title: 'Bektob Ismak Ya Bladi' },
    { artist: 'Sabah Fakhri', title: 'Ya Mal El Cham' },
    { artist: 'Wadih El Safi', title: 'Albi Sa\'al' },
    { artist: 'Farid El Atrache', title: 'Hekayat Gharami' },
  ],
  classique: [
    { artist: 'W.A. Mozart', title: 'Symphony No. 40 — Allegro' },
    { artist: 'L.v. Beethoven', title: 'Symphony No. 9 — Ode to Joy' },
    { artist: 'F. Chopin', title: 'Nocturne Op. 9 No. 2' },
    { artist: 'J.S. Bach', title: 'Air on the G String' },
    { artist: 'A. Vivaldi', title: 'Four Seasons — Spring' },
    { artist: 'C. Debussy', title: 'Clair de Lune' },
    { artist: 'M. Ravel', title: 'Boléro' },
  ],
  andalou: [
    { artist: 'Orchestre de Tétouan', title: 'Nouba Hijaz Kabir' },
    { artist: 'Orchestre Andalou de Fès', title: 'Nouba Al-Maya' },
    { artist: 'Hadj Mohamed Bajeddoub', title: 'Nouba Rasd Ad-Dhil' },
    { artist: 'Mohamed Larbi Temsamani', title: 'Nouba Iraq al-Ajam' },
    { artist: 'Cheikh Salim Fergani', title: 'Malouf Constantinois' },
  ],
  religieuse: [
    { artist: "Cheikh Maher Al-Mu'aiqly", title: 'Sourate Al-Kahf' },
    { artist: "Cheikh Mishary Al-Afasy", title: 'Sourate Yâ-Sîn' },
    { artist: 'Cheikh Abdul Rahman Al-Sudais', title: 'Sourate Al-Mulk' },
    { artist: 'Cheikh Saud Al-Shuraim', title: 'Sourate Ar-Rahman' },
    { artist: 'Cheikh Abdul Basit Abdul Samad', title: 'Sourate Maryam (mujawwad)' },
    { artist: 'Sami Yusuf', title: 'Allahuma Salli Ala Muhammad' },
    { artist: 'Maher Zain', title: 'Insha Allah' },
  ],
  jazz: [
    { artist: 'Norah Jones', title: "Don't Know Why" },
    { artist: 'Diana Krall', title: 'The Look of Love' },
    { artist: 'Miles Davis', title: 'So What' },
    { artist: 'John Coltrane', title: 'Naima' },
    { artist: 'Bill Evans', title: 'Waltz for Debby' },
    { artist: 'Ella Fitzgerald', title: 'Summertime' },
  ],
  electro: [
    { artist: 'Black Coffee', title: 'Drive (feat. David Guetta)' },
    { artist: 'David Guetta', title: 'Titanium' },
    { artist: 'Calvin Harris', title: 'Summer' },
    { artist: 'Tiesto', title: '10:35' },
    { artist: 'Avicii', title: 'Wake Me Up' },
    { artist: 'Solomun', title: 'Tale Of Us — Astral' },
  ],
  sport: [
    { artist: 'Mars Foot', title: 'Magazine — analyse Botola Pro' },
    { artist: 'Mars Sport', title: 'Débat post-match' },
    { artist: 'Allo Mars', title: 'Interview joueur' },
    { artist: 'Mars Khabar', title: 'Édition spéciale CAN' },
  ],
  business: [
    { artist: 'Cap Business', title: 'Magazine économique' },
    { artist: 'Cap Marchés', title: 'Bourse de Casablanca' },
    { artist: 'Atlantic Économie', title: 'Décryptage du jour' },
    { artist: 'Atlantic Magazine', title: 'Interview dirigeant' },
  ],
  info: [
    { artist: 'Médi 1 Soir', title: "Édition de l'information" },
    { artist: 'MCD Soir', title: 'Le journal' },
    { artist: 'Radio 2M', title: 'Magazine du jour' },
    { artist: 'Atlantic Info', title: 'Édition économique' },
  ],
};

// Map each station slug to its primary pool
const STATION_POOLS = {
  'hit-radio': 'pop_jeune',
  'mfm': 'rai',
  'medradio': 'pop_jeune',
  'medinafm': 'variete_arabe',
  'radio-aswat': 'variete_arabe',
  'chada-fm': 'variete_arabe',
  'cap-radio': 'business',
  'atlantic-radio': 'business',
  'medi-1-radio': 'info',
  'medi-1-tarab': 'tarab',
  'medi-1-classique': 'classique',
  'medi-1-radio-andalouse': 'andalou',
  'medi-1-dj': 'electro',
  'qoran-radio': 'religieuse',
  'al-quran-radio': 'religieuse',
  'radio-manarat': 'religieuse',
  'aziz-al-mustaphi': 'religieuse',
  'abdul-basit': 'religieuse',
  'zine-bladi': 'chaabi',
  'yabiladi-chaabi-maroc': 'chaabi',
  'yabiladi-azawan-amazigh': 'amazigh',
  'radio-atbir': 'amazigh',
  'radio-achkid-fm': 'amazigh',
  'radio-plus-agadir': 'amazigh',
  'marrakech-plus': 'pop_jeune',
  'fayroz': 'tarab',
  'rap-lbeldi-maroc': 'pop_jeune',
  'skyrock-casablanca': 'pop_jeune',
  'radio-2m': 'pop_jeune',
  'radio-yabiladi': 'chaabi',
  'radio-monte-carlo-doualiya': 'info',
  'only-rai': 'rai',
  'adwaa-fm': 'pop_jeune',
  'ness-radio': 'variete_arabe',
  'radio-mars': 'sport',
};

const slugify = (s) => String(s).toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function pickN(arr, n) {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

function timeStr(h, m) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

async function main() {
  await mkdir(HISTORY_DIR, { recursive: true });

  const radios = JSON.parse(await readFile(resolve(ROOT, 'public/radios.json'), 'utf8'));

  let written = 0, skipped = 0;
  const existing = new Set(
    (await readdir(HISTORY_DIR).catch(() => []))
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, ''))
  );

  for (const radio of radios) {
    const slug = slugify(radio.name);
    if (existing.has(slug)) { skipped += 1; continue; }

    const poolKey = STATION_POOLS[slug] || 'pop_jeune';
    const pool = POOLS[poolKey] || POOLS.pop_jeune;

    // Generate ~28 plays distributed over the morning + afternoon
    const songs = [];
    let h = 7, m = 0;
    for (let i = 0; i < 28; i++) {
      const track = pool[Math.floor(Math.random() * pool.length)];
      songs.push({ time: timeStr(h, m), artist: track.artist, title: track.title });
      // 6-7 min increments
      const step = 6 + Math.floor(Math.random() * 2);
      m += step;
      while (m >= 60) { m -= 60; h += 1; }
      if (h >= 10) break;
    }
    songs.sort((a, b) => a.time < b.time ? 1 : -1);

    const data = {
      radio: radio.name,
      slug,
      date: '2026-04-28',
      songs,
    };
    await writeFile(resolve(HISTORY_DIR, `${slug}.json`), JSON.stringify(data, null, 2));
    written += 1;
  }
  console.log(`✓ seed-songs: wrote ${written} files (skipped ${skipped} existing)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
