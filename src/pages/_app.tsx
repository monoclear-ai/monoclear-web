import { SessionProvider } from "next-auth/react"
import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import React from 'react'

import 'styles/App.css'
import 'styles/Contact.css'

import 'react-calendar/dist/Calendar.css'
import 'styles/MiniCalendar.css'
import Head from 'next/head'

import Script from "next/script";

console.log("*********ENV***********")
console.log(process.env.MAILCHIMP_API)

// This default export is required in a new `pages/_app.js` file.
/*
  This is the main app file.
  It is the first file that is loaded when the app is loaded.
  It is used to wrap the entire app with the ChakraProvider and the SessionProvider.
  Also performs Google Analytics setup.
*/
function MyApp ({ Component, pageProps: { session, ...pageProps} }: AppProps) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID;
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <Head>
          <title>Monoclear.ai (BETA)</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta name='theme-color' content='#000000' />
        </Head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <React.StrictMode>
          <Component {...pageProps} />
        </React.StrictMode>
      </ChakraProvider>
    </SessionProvider>
  )
}

export default MyApp
