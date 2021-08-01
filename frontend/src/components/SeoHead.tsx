import React from "react";
import Head from "next/head";

interface SeoHead {
  pageName: string;
}

export default function SeoHead({ pageName }: SeoHead) {
  return (
    <Head>
      <title>Tint - {pageName}</title>
      <meta property="og:title" content={`${pageName}`} />
      <meta name="description" content="TINT IS NOT TWITTER" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
  );
}
