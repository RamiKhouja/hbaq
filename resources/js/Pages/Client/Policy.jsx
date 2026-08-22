import ClientLayout from '@/Layouts/ClientLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileText, Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const policies = {
  delivery: {
    title: { en: 'Delivery Policy', fr: 'Politique de livraison', ar: 'سياسة التوصيل' },
    summary: {
      en: 'This policy explains how Hbaq prepares, schedules, and delivers fresh products while protecting their quality from our store to your door.',
      fr: 'Cette politique explique comment Hbaq prépare, planifie et livre les produits frais tout en préservant leur qualité jusqu’à votre porte.',
      ar: 'توضّح هذه السياسة كيف تحضّر حبق المنتجات الطازجة وتبرمج توصيلها وتحافظ على جودتها حتى تصل إلى بابكم.',
    },
    sections: [
      {
        title: { en: 'Delivery areas and availability', fr: 'Zones et disponibilité', ar: 'مناطق التوصيل والتوفّر' },
        body: {
          en: 'Delivery is offered within the areas displayed during checkout. Availability may depend on the customer’s address, order size, product type, vehicle capacity, and the selected delivery day. If an address is outside our regular service area, our team may contact the customer to propose collection, a different time, or an adjusted delivery fee.',
          fr: 'La livraison est proposée dans les zones affichées lors du paiement. Elle peut dépendre de l’adresse, du volume de la commande, du type de produit, de la capacité des véhicules et du jour choisi. Si une adresse se trouve hors de notre zone habituelle, notre équipe peut proposer un retrait, un autre créneau ou des frais adaptés.',
          ar: 'التوصيل متاح في المناطق التي تظهر عند إتمام الطلب، وقد يتغيّر حسب العنوان وحجم الطلب ونوع المنتجات وطاقة سيارات التوصيل واليوم المختار. إذا كان العنوان خارج منطقتنا المعتادة، يمكن لفريقنا اقتراح الاستلام من المحل أو موعد آخر أو معلوم توصيل مناسب.',
        },
      },
      {
        title: { en: 'Timing and order preparation', fr: 'Délais et préparation', ar: 'المواعيد وتحضير الطلب' },
        body: {
          en: 'Estimated delivery windows are provided for guidance and are not guaranteed appointment times. Fresh produce is selected and packed as close as practical to dispatch. Traffic, weather, seasonal demand, supplier delays, or exceptional events may affect arrival times, and we will make reasonable efforts to notify customers of a significant delay.',
          fr: 'Les créneaux indiqués sont des estimations et non des rendez-vous garantis. Les produits frais sont sélectionnés et emballés au plus près du départ. La circulation, la météo, la demande saisonnière ou un retard fournisseur peuvent modifier l’heure d’arrivée; nous ferons notre possible pour prévenir le client en cas de retard important.',
          ar: 'فترات التوصيل تقديرية وليست مواعيد مضمونة بالدقيقة. نختار المنتجات الطازجة ونغلّفها في أقرب وقت ممكن من موعد الانطلاق. قد تؤثّر حركة المرور أو الطقس أو ضغط الموسم أو تأخير المزوّدين، وسنحاول إعلام الحريف عند وجود تأخير مهم.',
        },
      },
      {
        title: { en: 'Receiving your order', fr: 'Réception de la commande', ar: 'استلام الطلب' },
        body: {
          en: 'A responsible person should be available at the delivery address and provide safe access. Customers should check the number of packages and the visible condition of fresh items when receiving them. Instructions left at checkout are followed when reasonably possible, but unattended delivery is performed at the customer’s risk.',
          fr: 'Une personne responsable doit être présente à l’adresse et permettre un accès sûr. Le client est invité à vérifier le nombre de colis et l’état visible des produits frais à la réception. Les instructions sont suivies dans la mesure du possible, mais une livraison laissée sans surveillance reste sous la responsabilité du client.',
          ar: 'يجب أن يكون شخص مسؤول موجوداً في العنوان وأن يوفّر وصولاً آمناً. يُرجى التثبت من عدد الطرود والحالة الظاهرة للمنتجات الطازجة عند الاستلام. نحاول اتباع الملاحظات المسجّلة مع الطلب، لكن ترك الطلب دون مراقبة يكون على مسؤولية الحريف.',
        },
      },
      {
        title: { en: 'Freshness issues and missing items', fr: 'Fraîcheur et articles manquants', ar: 'مشاكل الجودة والنواقص' },
        body: {
          en: 'Please report damaged, unsuitable, or missing products as soon as possible after delivery and include photographs where helpful. Because fresh products are perishable, prompt notice allows us to review storage and transport conditions. After verification, we may replace the item, issue store credit, or refund its value as appropriate.',
          fr: 'Tout produit endommagé, impropre ou manquant doit être signalé rapidement après la livraison, avec des photos si possible. Les produits frais étant périssables, un signalement rapide facilite la vérification des conditions de transport. Après contrôle, nous pouvons remplacer l’article, accorder un avoir ou rembourser sa valeur.',
          ar: 'يرجى إعلامنا في أقرب وقت بأي منتج ناقص أو متضرر أو غير صالح، مع صور إن أمكن. بما أن المنتجات الطازجة سريعة التلف، يساعدنا الإعلام السريع على مراجعة ظروف النقل والحفظ. بعد التثبت، يمكننا التعويض بمنتج آخر أو رصيد شراء أو إرجاع قيمة المنتج.',
        },
      },
      {
        title: { en: 'Changes and failed delivery', fr: 'Modifications et échec de livraison', ar: 'تعديل الطلب وتعذّر التوصيل' },
        body: {
          en: 'Contact us promptly if an address, telephone number, or delivery instruction changes. Orders already prepared or dispatched may not be changed or cancelled. If delivery fails because no one is available, access is unsafe, or contact details are incorrect, a second delivery may require a new fee and perishable items may not be eligible for refund.',
          fr: 'Contactez-nous rapidement en cas de changement d’adresse, de téléphone ou d’instruction. Une commande déjà préparée ou expédiée ne peut pas toujours être modifiée ou annulée. Si la livraison échoue en raison d’une absence, d’un accès dangereux ou de coordonnées erronées, une nouvelle livraison peut être facturée et les produits périssables ne sont pas nécessairement remboursables.',
          ar: 'اتصلوا بنا سريعاً إذا تغيّر العنوان أو رقم الهاتف أو تعليمات التوصيل. قد يتعذّر تعديل أو إلغاء الطلب بعد تحضيره أو إرساله. إذا فشل التوصيل بسبب غياب المستلم أو صعوبة الدخول أو خطأ في البيانات، يمكن احتساب معلوم جديد، وقد لا يمكن إرجاع ثمن المنتجات سريعة التلف.',
        },
      },
    ],
  },
  privacy: {
    title: { en: 'Privacy Policy', fr: 'Politique de confidentialité', ar: 'سياسة الخصوصية' },
    summary: {
      en: 'This policy describes the personal information Hbaq uses to operate the website, fulfil orders, support customers, and improve its services.',
      fr: 'Cette politique décrit les données personnelles utilisées par Hbaq pour exploiter le site, traiter les commandes, assister les clients et améliorer ses services.',
      ar: 'تشرح هذه السياسة البيانات الشخصية التي تستعملها حبق لتشغيل الموقع وتنفيذ الطلبات ومساعدة الحرفاء وتحسين الخدمات.',
    },
    sections: [
      { title: { en: 'Information we collect', fr: 'Données collectées', ar: 'البيانات التي نجمعها' }, body: { en: 'We may collect identity and contact details, delivery addresses, account information, order history, customer messages, and payment status. We also receive basic technical information such as device type, browser, pages visited, and approximate location from server logs or analytics tools. Payment card details, when applicable, are handled by the selected payment provider and are not intended to be stored directly by Hbaq.', fr: 'Nous pouvons collecter l’identité, les coordonnées, les adresses de livraison, les informations du compte, l’historique des commandes, les messages et le statut des paiements. Des données techniques comme le navigateur, l’appareil, les pages visitées et la localisation approximative peuvent aussi être enregistrées. Les données de carte sont traitées par le prestataire de paiement et ne sont pas destinées à être stockées directement par Hbaq.', ar: 'قد نجمع بيانات الهوية والاتصال وعناوين التوصيل ومعلومات الحساب وسجل الطلبات والرسائل وحالة الدفع. كما قد تسجّل الخوادم أو أدوات الإحصاء معلومات تقنية مثل الجهاز والمتصفح والصفحات والموقع التقريبي. بيانات البطاقة، عند استعمالها، يعالجها مزوّد الدفع ولا يُفترض أن تخزّنها حبق مباشرة.' } },
      { title: { en: 'How information is used', fr: 'Utilisation des données', ar: 'كيف نستعمل البيانات' }, body: { en: 'Information is used to create and secure accounts, confirm and deliver orders, answer enquiries, prevent misuse, comply with accounting or legal duties, and improve the shopping experience. Where permitted, we may send service updates or relevant offers. Promotional communication can be declined at any time without affecting essential order messages.', fr: 'Les données servent à créer et sécuriser les comptes, confirmer et livrer les commandes, répondre aux demandes, prévenir les abus, respecter nos obligations et améliorer l’expérience. Lorsque cela est permis, nous pouvons envoyer des informations ou offres pertinentes. Les communications promotionnelles peuvent être refusées sans affecter les messages indispensables au suivi des commandes.', ar: 'نستعمل البيانات لإنشاء الحسابات وحمايتها وتأكيد الطلبات وتوصيلها والرد على الاستفسارات ومنع سوء الاستعمال والوفاء بالالتزامات وتحسين تجربة التسوق. عند السماح بذلك، يمكن إرسال أخبار أو عروض مناسبة، ويمكن رفض الرسائل الإشهارية في أي وقت دون التأثير على رسائل الطلب الأساسية.' } },
      { title: { en: 'Sharing and service providers', fr: 'Partage et prestataires', ar: 'مشاركة البيانات ومزوّدو الخدمة' }, body: { en: 'We share only the information reasonably needed by providers that help with hosting, payment, delivery, customer support, analytics, or professional advice. These parties are expected to protect the information and use it for the agreed service. We may also disclose information when required by law, to protect customers and our business, or in connection with a legitimate business reorganisation.', fr: 'Nous partageons uniquement les données nécessaires avec les prestataires d’hébergement, paiement, livraison, assistance, analyse ou conseil. Ils doivent protéger ces données et les utiliser pour le service convenu. Une divulgation peut également avoir lieu si la loi l’exige, pour protéger les clients et l’entreprise, ou dans le cadre d’une réorganisation légitime.', ar: 'نشارك فقط المعلومات الضرورية مع مزوّدي الاستضافة والدفع والتوصيل وخدمة الحرفاء والتحليل والاستشارة، وعليهم حمايتها واستعمالها للخدمة المتفق عليها. قد نكشف المعلومات أيضاً إذا فرض القانون ذلك أو لحماية الحرفاء والمؤسسة أو ضمن إعادة تنظيم تجارية مشروعة.' } },
      { title: { en: 'Storage and security', fr: 'Conservation et sécurité', ar: 'الحفظ والأمان' }, body: { en: 'We keep personal information only as long as needed for the purpose for which it was collected, including legal, tax, warranty, and dispute requirements. We use reasonable organisational and technical safeguards, but no internet system is completely secure. Customers should use a strong password, keep account credentials confidential, and notify us promptly of suspected unauthorised access.', fr: 'Les données sont conservées uniquement pendant la durée nécessaire, notamment pour les obligations légales, fiscales, de garantie ou de litige. Nous appliquons des mesures techniques et organisationnelles raisonnables, sans qu’aucun système internet soit totalement sûr. Le client doit choisir un mot de passe robuste, protéger ses identifiants et signaler rapidement tout accès suspect.', ar: 'نحتفظ بالبيانات للمدة اللازمة للغرض الذي جُمعت من أجله، بما في ذلك المتطلبات القانونية والجبائية والضمان والنزاعات. نعتمد وسائل حماية تقنية وتنظيمية معقولة، لكن لا يوجد نظام إنترنت آمن كلياً. على الحريف اختيار كلمة سر قوية وحماية بيانات الدخول وإعلامنا سريعاً بأي دخول مشبوه.' } },
      { title: { en: 'Your choices and requests', fr: 'Vos choix et demandes', ar: 'اختياراتكم وطلباتكم' }, body: { en: 'Depending on applicable law, customers may ask to access, correct, update, restrict, or delete their personal information, or object to certain uses. Some records must be retained for legal or transaction purposes even after an account is closed. Requests should be sent through our contact details, and we may need to verify identity before responding.', fr: 'Selon la loi applicable, le client peut demander l’accès, la correction, la mise à jour, la limitation ou la suppression de ses données, ou s’opposer à certains usages. Certains documents doivent rester conservés pour des raisons légales ou transactionnelles après la fermeture du compte. Les demandes sont adressées via nos coordonnées et peuvent nécessiter une vérification d’identité.', ar: 'حسب القانون المعمول به، يمكن للحريف طلب الاطلاع على بياناته أو تصحيحها أو تحديثها أو تقييدها أو حذفها، أو الاعتراض على بعض الاستعمالات. قد يلزم حفظ بعض السجلات لأسباب قانونية أو مرتبطة بالمعاملات حتى بعد إغلاق الحساب. تُرسل الطلبات عبر وسائل الاتصال وقد نحتاج إلى التثبت من الهوية.' } },
    ],
  },
  terms: {
    title: { en: 'Terms & Conditions', fr: 'Conditions générales', ar: 'الشروط والأحكام' },
    summary: { en: 'These terms set out the rules that apply when visitors use Hbaq’s website, create an account, or purchase products and services.', fr: 'Ces conditions définissent les règles applicables à l’utilisation du site Hbaq, à la création d’un compte et à l’achat de produits ou services.', ar: 'تحدّد هذه الشروط القواعد التي تنطبق عند استعمال موقع حبق أو إنشاء حساب أو شراء المنتجات والخدمات.' },
    sections: [
      { title: { en: 'Using the website', fr: 'Utilisation du site', ar: 'استعمال الموقع' }, body: { en: 'By accessing or using the website, you agree to these terms and confirm that the information you provide is accurate. You must use the website lawfully and must not interfere with its operation, attempt unauthorised access, copy protected content, submit harmful material, or use the service to mislead or harm another person. We may restrict access where necessary to protect the website, customers, or business.', fr: 'En accédant au site, vous acceptez ces conditions et confirmez l’exactitude des informations fournies. Vous devez utiliser le site légalement, sans perturber son fonctionnement, tenter un accès non autorisé, copier un contenu protégé, transmettre un élément nuisible ou tromper autrui. Nous pouvons limiter l’accès lorsque cela est nécessaire pour protéger le site, les clients ou l’entreprise.', ar: 'باستعمال الموقع، توافقون على هذه الشروط وتؤكدون صحة المعلومات المقدّمة. يجب استعمال الموقع بطريقة قانونية ودون تعطيل عمله أو محاولة دخول غير مرخّص أو نسخ محتوى محمي أو إرسال مواد ضارة أو تضليل الغير. يمكننا تقييد الدخول عند الحاجة لحماية الموقع أو الحرفاء أو المؤسسة.' } },
      { title: { en: 'Products, prices, and availability', fr: 'Produits, prix et disponibilité', ar: 'المنتجات والأسعار والتوفّر' }, body: { en: 'We aim to display accurate descriptions, images, prices, and availability. Natural fresh products may vary in size, colour, maturity, weight, or appearance, and screen images are illustrative. Prices and promotions may change before an order is confirmed. If an item becomes unavailable or an obvious pricing error occurs, we may contact you to approve a substitute or adjustment, or cancel and refund the affected item.', fr: 'Nous nous efforçons d’afficher des descriptions, images, prix et stocks exacts. Les produits frais naturels peuvent varier en taille, couleur, maturité, poids ou apparence; les images sont illustratives. Les prix et promotions peuvent changer avant confirmation. En cas d’indisponibilité ou d’erreur manifeste, nous pouvons proposer un remplacement, un ajustement, ou annuler et rembourser l’article concerné.', ar: 'نسعى لعرض أوصاف وصور وأسعار وكميات دقيقة. قد تختلف المنتجات الطبيعية الطازجة في الحجم واللون والنضج والوزن والشكل، والصور توضيحية. يمكن أن تتغيّر الأسعار والعروض قبل تأكيد الطلب. إذا نفد منتج أو ظهر خطأ واضح في السعر، يمكننا اقتراح بديل أو تعديل أو إلغاء المنتج وإرجاع قيمته.' } },
      { title: { en: 'Orders and payment', fr: 'Commandes et paiement', ar: 'الطلبات والدفع' }, body: { en: 'Submitting an order is an offer to purchase. An order is accepted when we confirm it or begin fulfilment, subject to product availability and payment validation. Customers are responsible for reviewing quantities, addresses, and contact details before confirmation. We may refuse or cancel an order affected by suspected fraud, an operational limitation, an obvious error, or a breach of these terms, and any eligible payment will be returned.', fr: 'L’envoi d’une commande constitue une offre d’achat. Elle est acceptée lors de sa confirmation ou du début de sa préparation, sous réserve du stock et de la validation du paiement. Le client doit vérifier quantités, adresse et coordonnées. Nous pouvons refuser ou annuler une commande en cas de fraude présumée, contrainte opérationnelle, erreur manifeste ou violation de ces conditions, avec remboursement des sommes admissibles.', ar: 'إرسال الطلب هو عرض شراء، ويُقبل عند تأكيده أو بدء تحضيره، حسب توفّر المنتجات وصحة الدفع. الحريف مسؤول عن مراجعة الكميات والعنوان وبيانات الاتصال قبل التأكيد. يمكننا رفض أو إلغاء طلب عند الاشتباه في التحيل أو وجود عائق تشغيلي أو خطأ واضح أو مخالفة الشروط، مع إرجاع المبالغ المستحقة.' } },
      { title: { en: 'Cancellations, returns, and refunds', fr: 'Annulations, retours et remboursements', ar: 'الإلغاء والإرجاع واسترجاع الأموال' }, body: { en: 'Contact us quickly if you need to cancel or correct an order. Fresh, chilled, customised, or already dispatched products may not be cancellable or returnable unless they are defective, damaged, or incorrectly supplied. Approved refunds are made using a suitable available method and may require processing time. Nothing in these terms removes rights that customers have under mandatory consumer law.', fr: 'Contactez-nous rapidement pour annuler ou corriger une commande. Les produits frais, réfrigérés, personnalisés ou déjà expédiés ne peuvent pas toujours être annulés ou retournés, sauf défaut, dommage ou erreur de livraison. Les remboursements approuvés sont effectués par un moyen disponible et peuvent nécessiter un délai. Ces conditions ne suppriment aucun droit impératif du consommateur.', ar: 'اتصلوا بنا سريعاً لإلغاء الطلب أو تصحيحه. قد لا يمكن إلغاء أو إرجاع المنتجات الطازجة أو المبرّدة أو المخصّصة أو التي خرجت للتوصيل، إلا إذا كانت معيبة أو متضررة أو أُرسلت بالخطأ. يتم إرجاع الأموال المقبولة بوسيلة متاحة وقد يتطلب ذلك وقت معالجة. لا تلغي هذه الشروط الحقوق الإلزامية التي يمنحها القانون للمستهلك.' } },
      { title: { en: 'Responsibility and changes', fr: 'Responsabilité et modifications', ar: 'المسؤولية وتعديل الشروط' }, body: { en: 'We are responsible for providing the service with reasonable care, but we are not liable for losses caused by circumstances outside reasonable control, misuse of products, incorrect customer information, or failure to follow storage and safety instructions. We may update these terms to reflect changes in law, technology, or service. The version published when an order is placed normally applies to that order.', fr: 'Nous fournissons le service avec un soin raisonnable, mais ne répondons pas des pertes dues à des circonstances hors de notre contrôle, à un mauvais usage, à des informations client incorrectes ou au non-respect des consignes de conservation. Ces conditions peuvent évoluer avec la loi, la technologie ou le service. La version publiée lors de la commande s’applique normalement à celle-ci.', ar: 'نقدّم الخدمة بعناية معقولة، لكننا لا نتحمّل الخسائر الناتجة عن ظروف خارجة عن سيطرتنا أو سوء استعمال المنتجات أو بيانات حريف خاطئة أو عدم اتباع تعليمات الحفظ والسلامة. يمكن تحديث الشروط عند تغيّر القانون أو التقنية أو الخدمة، وعادةً تنطبق النسخة المنشورة وقت الطلب على ذلك الطلب.' } },
    ],
  },
};

export default function Policy({ auth, policy }) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.split('-')[0] ?? i18n.language ?? 'en';
  const isArabic = language === 'ar';
  const content = policies[policy] ?? policies.terms;
  const tr = (value) => value?.[language] ?? value?.en ?? '';

  return (
    <ClientLayout user={auth?.user} noLimits={true}>
      <Head title={tr(content.title)} />
      <main className="min-h-screen bg-[#f7f9f2] text-slate-800" dir={isArabic ? 'rtl' : 'ltr'}>
        <section className="relative overflow-hidden bg-[#162515] text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-[#162515] to-orange-950/60" />
          <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-black/20">
              <FileText className="h-6 w-6" />
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-orange-300">Hbaq · حبق</p>
            <h1 className={`mt-3 text-4xl font-black sm:text-5xl ${isArabic ? 'font-hudhud' : ''}`}>{tr(content.title)}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/75 sm:text-lg">{tr(content.summary)}</p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-8 flex items-center justify-between gap-4 border-b border-green-900/10 pb-6">
            <p className="text-sm text-slate-500">
              {isArabic ? 'آخر تحديث: أغسطس 2026' : language === 'fr' ? 'Dernière mise à jour : août 2026' : 'Last updated: August 2026'}
            </p>
            <Leaf className="h-6 w-6 text-green-700" />
          </div>

          <div className="space-y-6">
            {content.sections.map((section, index) => (
              <article key={tr(section.title)} className="rounded-3xl border border-green-900/10 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-black text-orange-700">
                    {index + 1}
                  </span>
                  <div>
                    <h2 className={`text-xl font-bold text-slate-900 sm:text-2xl ${isArabic ? 'font-hudhud' : ''}`}>{tr(section.title)}</h2>
                    <p className="mt-4 text-base leading-8 text-slate-600">{tr(section.body)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <Link href="/" className="mt-10 inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-600">
            <ArrowLeft className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
            {isArabic ? 'العودة إلى الصفحة الرئيسية' : language === 'fr' ? 'Retour à l’accueil' : 'Back to home'}
          </Link>
        </section>
      </main>
    </ClientLayout>
  );
}
