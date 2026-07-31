import Script from "next/script";

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="stylesheet" href="/vendors/feather/feather.css" />
      <link rel="stylesheet" href="/vendors/ti-icons/css/themify-icons.css" />
      <link rel="stylesheet" href="/vendors/css/vendor.bundle.base.css" />
      <link rel="stylesheet" href="/css/vertical-layout-light/style.css" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        rel="stylesheet"
      />
      
      {children}

      <Script src="/vendors/js/vendor.bundle.base.js" strategy="beforeInteractive" />
      <Script src="/js/off-canvas.js" strategy="lazyOnload" />
      <Script src="/js/hoverable-collapse.js" strategy="lazyOnload" />
      <Script src="/js/template.js" strategy="lazyOnload" />
      {/* Face API */}
      <Script src="/js/face-api/face-api.min.js" strategy="beforeInteractive" />
    </>
  );
}
