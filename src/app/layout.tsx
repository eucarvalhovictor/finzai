import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/config';
import type { SeoSettings } from '@/lib/types';
import { cn } from '@/lib/utils';

// Initialize Firebase for server-side usage (e.g., in generateMetadata)
const serverApp = initializeFirebase();
const db = getFirestore(serverApp);

// This function is run on the server to generate metadata for the page
export async function generateMetadata(): Promise<Metadata> {
  // Define default values
  let siteTitle = 'FinzAI';
  let siteDescription = 'Your personal finance dashboard.';
  let faviconUrl: string | undefined = undefined;

  try {
    const seoSettingsRef = doc(db, 'settings', 'globalSeo');
    const seoSettingsSnap = await getDoc(seoSettingsRef);

    if (seoSettingsSnap.exists()) {
      const settings = seoSettingsSnap.data() as SeoSettings;
      siteTitle = settings.siteTitle || siteTitle;
      siteDescription = settings.defaultDescription || siteDescription;
      faviconUrl = settings.faviconUrl || undefined;
    }
  } catch (error) {
    // If there's an error fetching (e.g., Firestore not ready, permissions),
    // fall back to the default values.
    console.error("Could not fetch SEO settings for metadata:", error);
  }

  return {
    title: siteTitle,
    description: siteDescription,
    icons: {
      icon: faviconUrl,
    },
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-full">
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
