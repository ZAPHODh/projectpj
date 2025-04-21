// 'use client';

// import { CookieState, useCookiesPolicy } from '@/hooks/use-cookiespolicy';
// import Script from 'next/script';

// import { useEffect, useState } from 'react';
// declare global {
//   interface Window {
//     dataLayer: any[]; // Ou um tipo mais específico se você souber a estrutura
//     gtag: (...args: any[]) => void; // Já que você também usa gtag
//   }
// }
// export default function Analytics() {
//   const { cookieState } = useCookiesPolicy();
//   const [consent, setConsent] = useState<'granted' | 'denied' | undefined>(undefined);

//   useEffect(() => {
//     if (cookieState === CookieState.ACCEPTED) {
//       setConsent('granted');
//     } else if (cookieState === CookieState.REJECTED) {
//       setConsent('denied');
//     } else {
//       setConsent('denied'); // Ou deixe como undefined e trate no GTM
//     }
//   }, [cookieState]);

//   useEffect(() => {
//     if (typeof window !== 'undefined' && consent) {
//       window.dataLayer = window.dataLayer || [];
//       function gtag() { dataLayer.push(arguments); }
//       gtag('consent', 'default', {
//         'ad_storage': consent,
//         'analytics_storage': consent,
//         'ad_personalization': consent,
//         'ad_user_data': consent,
//         'fb_pixel': consent
//       });
//     }
//   }, [consent]);

//   if (!process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || !process.env.NEXT_PUBLIC_GTM_ID) {
//     return null; // Evita renderizar os scripts sem as variáveis de ambiente
//   }

//   return (
//     <>
//       <Script
//         async
//         src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}`}
//         crossOrigin="anonymous"
//         strategy="afterInteractive"
//       />
//       <Script
//         id="gtm"
//         strategy="afterInteractive" // Tente carregar após a interação
//         dangerouslySetInnerHTML={{
//           __html: `
//                         (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
//                         new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
//                         j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
//                         'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
//                         })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
//                     `,
//         }}
//       />
//     </>
//   );
// }








// 'use client';

// import { CookieState, useCookiesPolicy } from '@/hooks/use-cookiespolicy'
// import Script from 'next/script'

// export default function Analytics() {
//   const { cookieState } = useCookiesPolicy()
//   const consent = cookieState === CookieState.ACCEPTED ? 'granted' : 'denied'

//   return (
//     <>
//       {/* Configurar consentimento antes de carregar scripts */}
//       <Script
//         id="gtm-consent"
//         strategy="beforeInteractive"
//         dangerouslySetInnerHTML={{
//           __html: `
//             window.dataLayer = window.dataLayer || [];
//             function gtag(){dataLayer.push(arguments);}

//             gtag('consent', 'default', {
//               'ad_storage': '${consent}',
//               'analytics_storage': '${consent}',
//               'ad_personalization': '${consent}',
//               'ad_user_data': '${consent}',
//               'fb_pixel': '${consent}'
//             });
//           `,
//         }}
//       />

//       {/* Carregar GTM com consentimento configurado */}
//       <Script
//         id="gtm-script"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: `
//             (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
//             new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
//             j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
//             'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
//             })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
//           `,
//         }}
//       />

//       {/* Adsense com consentimento */}
//       {consent === 'granted' && (
//         <Script
//           async
//           src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}`}
//           crossOrigin="anonymous"
//           strategy="afterInteractive"
//         />
//       )}
//     </>
//   )
// }

// 'use client';



import Script from "next/script";

export default function Adsense() {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process
        .env.NEXT_PUBLIC_ADSENSE_PUB_ID!}`
      }
      crossOrigin="anonymous"
      strategy="lazyOnload"
    > </Script>
  );
}
// import { CookieState, useCookiesPolicy } from '@/hooks/use-cookiespolicy'
// import Script from 'next/script'


// export default function Analytics() {
//   const { cookieState } = useCookiesPolicy()

//   // Note: If pending it will be denied
//   const consent = cookieState === CookieState.ACCEPTED ? 'granted' : 'denied'

//   return (
//     <>
//       <Script
//         async
//         src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process
//           .env.NEXT_PUBLIC_ADSENSE_PUB_ID!}`
//         }
//         crossOrigin="anonymous"
//         strategy="afterInteractive"
//       > </Script>
//       <Script
//         id="gtm"
//         dangerouslySetInnerHTML={{
//           __html: `
//             window.dataLayer = window.dataLayer || [];
//             function gtag(){dataLayer.push(arguments);}

//             const consent = '${consent}';

//             gtag('consent', 'default', {
//               'ad_storage': consent,
//               'analytics_storage': consent,
//               'ad_personalization': consent,
//               'ad_user_data': consent,
//               'fb_pixel': consent
//             });

//             (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
//             new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
//             j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
//             'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
//             })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`,
//         }}
//       />
//     </>
//   )
// }