import { Link } from 'react-router-dom';

/**
 * Arabic home page long-form SEO copy.
 * Targets queries: "إذاعات مغربية مباشر", "راديو المغرب أون لاين",
 * "إذاعة المغرب من الخارج", "راديو مغربي مجاني".
 * ~750 words native Arabic, no auto-translation.
 */
export default function HomeContentAr() {
  return (
    <section className="mt-16 sm:mt-24 max-w-4xl mx-auto text-white/75 leading-loose">
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6 text-balance">
        إذاعات المغرب مباشر — استمع إلى جميع راديوهات المغرب أون لاين مجاناً
      </h2>

      <p className="mb-5 text-[15px]">
        مرحباً بكم في <strong>إذاعات المغرب</strong>، البوابة المرجعية للاستماع
        المباشر إلى جميع <strong>الإذاعات المغربية</strong> عبر الأنترنت. أكثر
        من 30 محطة FM وراديو على الويب من المملكة المغربية تبث إشارتها على منصتنا:
        <em> هيت راديو</em>، <em>راديو مارس</em>، <em>شدى إف إم</em>،
        <em> ميدي1</em>، <em>راديو 2M</em>، <em>MFM</em>، <em>مدينة إف إم</em>،
        <em> كاب راديو</em>، <em>أتلانتيك راديو</em>، <em>راديو أصوات</em>،
        <em> راديو القرآن الكريم</em> والعديد من الإذاعات الأخرى.{' '}
        <strong>الاستماع مجاني تماماً، بدون تسجيل ودون تحميل أي تطبيق</strong>،
        ويعمل على الحاسوب والهاتف واللوحة الإلكترونية، من أي مكان في العالم.
      </p>

      <h2 className="font-display text-2xl font-bold text-white mt-10 mb-4">
        جميع الإذاعات المغربية في منصة واحدة
      </h2>
      <p className="mb-5 text-[15px]">
        يعتبر المشهد الإذاعي المغربي من أغنى المشاهد في العالم العربي. منذ
        تحرير الموجات الإذاعية سنة 2006، انضمت عشرات الإذاعات الخاصة الجديدة
        إلى القنوات التاريخية للشركة الوطنية للإذاعة والتلفزة (SNRT) ومجموعة
        2M العمومية. توحد منصتنا كل هذه المحطات لتمكنك من{' '}
        <strong>الاستماع إلى الراديو المغربي</strong> مباشرة، بجودة عالية،
        أينما كنت.
      </p>

      <h2 className="font-display text-2xl font-bold text-white mt-10 mb-4">
        راديوهات المغرب مصنفة حسب النوع
      </h2>
      <ul className="list-disc pr-6 mb-5 space-y-2 marker:text-brand-300 text-[15px]">
        <li>
          <Link to="/ar/radio-maroc-hit" className="text-white hover:text-brand-300 underline-offset-2 hover:underline font-semibold">إذاعات الموسيقى والهيت</Link>
          {' '}— هيت راديو، MFM، ميد راديو، أصوات، شدى إف إم: موسيقى البوب والآر
          آند بي والأغاني العالمية والعربية لجمهور الشباب والكبار.
        </li>
        <li>
          <Link to="/ar/radio-maroc-chaabi" className="text-white hover:text-brand-300 underline-offset-2 hover:underline font-semibold">راديو الشعبي المغربي</Link>
          {' '}— الموسيقى الشعبية الحضرية والعيطة والحيحة والموال، حاضرة على
          إذاعتي زين بلادي ويابلادي شعبي.
        </li>
        <li>
          <Link to="/ar/radio-maroc-amazigh" className="text-white hover:text-brand-300 underline-offset-2 hover:underline font-semibold">الإذاعات الأمازيغية</Link>
          {' '}— يابلادي أزوان أمازيغ، راديو أتبير، راديو أشكيد إف إم: محطات
          تحتفي بثراء الثقافة الأمازيغية وإيقاعات السوس والريف والأطلس.
        </li>
        <li>
          <strong>إذاعات الرياضة</strong> — راديو مارس، أول إذاعة رياضية 100%
          في المغرب، تنقل مباريات البطولة الاحترافية وكأس أمم إفريقيا.
        </li>
        <li>
          <strong>الإذاعات الدينية</strong> — راديو القرآن، إذاعة منارات: قراءات
          القرآن الكريم على مدار الساعة من أشهر القراء في العالم الإسلامي.
        </li>
        <li>
          <strong>الإذاعات الدولية</strong> — ميدي1 (ثنائية اللغة)، مونت كارلو
          الدولية، راديو يابلادي للجالية المغربية في الخارج.
        </li>
      </ul>

      <h2 className="font-display text-2xl font-bold text-white mt-10 mb-4">
        الاستماع إلى الراديو المغربي من أي مكان في العالم
      </h2>
      <p className="mb-5 text-[15px]">
        سواء كنت في{' '}
        <Link to="/ar/radio-casablanca" className="text-brand-300 hover:underline">الدار البيضاء</Link>،{' '}
        <Link to="/ar/radio-rabat" className="text-brand-300 hover:underline">الرباط</Link>،{' '}
        <Link to="/ar/radio-marrakech" className="text-brand-300 hover:underline">مراكش</Link>،{' '}
        <Link to="/ar/radio-tanger" className="text-brand-300 hover:underline">طنجة</Link>،{' '}
        <Link to="/ar/radio-fes" className="text-brand-300 hover:underline">فاس</Link> أو{' '}
        <Link to="/ar/radio-agadir" className="text-brand-300 hover:underline">أكادير</Link>،
        أو خارج المغرب، فإن منصتنا توفر لك إذاعتك المفضلة دون انقطاع وبدون
        إعلانات مزعجة. <strong>إذاعات المغرب أون لاين</strong> تستعملها بشكل
        خاص <strong>الجالية المغربية في الخارج</strong> للحفاظ على الرابط
        بالثقافة والأخبار وموسيقى الوطن. أبناء الجالية في{' '}
        <Link to="/ar/min-faransa" className="text-brand-300 hover:underline">فرنسا</Link>،{' '}
        <Link to="/ar/min-belgika" className="text-brand-300 hover:underline">بلجيكا</Link>،{' '}
        <Link to="/ar/min-holanda" className="text-brand-300 hover:underline">هولندا</Link>،{' '}
        <Link to="/ar/min-isbania" className="text-brand-300 hover:underline">إسبانيا</Link>،{' '}
        <Link to="/ar/min-italia" className="text-brand-300 hover:underline">إيطاليا</Link>،{' '}
        <Link to="/ar/min-almania" className="text-brand-300 hover:underline">ألمانيا</Link>،{' '}
        <Link to="/ar/min-kanada" className="text-brand-300 hover:underline">كندا</Link>،{' '}
        <Link to="/ar/min-amrika" className="text-brand-300 hover:underline">أمريكا</Link>{' '}
        وفي جميع أنحاء العالم يمكنهم الاستماع إلى هيت راديو وميدي1 وشدى إف إم
        تماماً كما لو كانوا في البيت.
      </p>

      <h2 className="font-display text-2xl font-bold text-white mt-10 mb-4">
        لماذا الاستماع للراديو عبر الأنترنت بدلاً من FM؟
      </h2>
      <p className="mb-5 text-[15px]">
        البث المباشر عبر الأنترنت يقدم عدة مزايا مقارنة بالبث FM التقليدي:
        جودة صوتية متفوقة (تصل إلى 256 كيلو بت في الثانية بتنسيق HLS HD لراديو
        2M أو ميدي1)، غياب التشويش، الاستماع المتزامن على عدة أجهزة، الوصول إلى
        إذاعات الويب التي لا تملك تردداً FM (يابلادي، راب لبلدي المغرب، فيروز).
        كما أن أغلب الإذاعات المغربية الكبرى أصبحت تبث الآن بتنسيق{' '}
        <a href="https://en.wikipedia.org/wiki/HTTP_Live_Streaming" target="_blank" rel="noopener" className="text-brand-300 hover:underline">HLS</a>{' '}
        أو MP3، مما يضمن صوتاً نقياً واستهلاكاً منخفضاً للبيانات.
      </p>

      <h2 className="font-display text-2xl font-bold text-white mt-10 mb-4">
        أسئلة شائعة
      </h2>
      <h3 className="font-display text-lg font-semibold text-white mt-5 mb-2">
        هل الاستماع مجاني فعلاً؟
      </h3>
      <p className="mb-3 text-[15px]">
        نعم، مجاني تماماً. لا حاجة لحساب، لا اشتراك، لا حد للاستماع.
      </p>
      <h3 className="font-display text-lg font-semibold text-white mt-5 mb-2">
        هل يمكن الاستماع من خارج المغرب؟
      </h3>
      <p className="mb-3 text-[15px]">
        نعم، جميع الإذاعات المغربية المتاحة على المنصة قابلة للاستماع من
        الخارج، دون VPN.
      </p>
      <h3 className="font-display text-lg font-semibold text-white mt-5 mb-2">
        هل جودة الصوت جيدة؟
      </h3>
      <p className="mb-3 text-[15px]">
        نبث التدفقات الرسمية للإذاعات. تعتمد الجودة على التدفق الذي توفره
        المحطة - بين 64 و256 كيلو بت في الثانية حسب الإذاعة.
      </p>
      <h3 className="font-display text-lg font-semibold text-white mt-5 mb-2">
        كيف يمكن إضافة إذاعة غير موجودة؟
      </h3>
      <p className="mb-3 text-[15px]">
        يتم تحديث كتالوجنا تلقائياً كل يوم عبر API العمومي Radio-Browser.
        المحطات الجديدة تظهر تلقائياً.
      </p>
    </section>
  );
}
