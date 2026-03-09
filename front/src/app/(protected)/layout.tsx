"use client"
import Navbar from "@/components/navbar";
import Btn from "@/components/btn";
import { useRouter } from "next/navigation";
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";

// Protected layout - wraps authenticated pages with navbar and logout button
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const router = useRouter();
  // Auto-logout timer - redirects to login page after 1 hour (3600000ms) to refresh authentication token
  const startTimer = () => {
    let timer = setTimeout(() => {
      router.push('/')
    }, 3600000)
    return timer;
  }

  // Sets up auto-logout timer on component mount - clears timer on unmount to prevent memory leaks
  useEffect(() => {
    let timer = startTimer();
    return () => clearTimeout(timer);
  }, [])

  return (
    <div className="flex flex-col w-full min-h-screen relative overflow-hidden items-center justify-start md:pl-36 pb-24 md:pb-3 p-2 md:p-3">
      <div className="flex w-full mb-5 bg-[#0f0f0f]/95 border border-neutral-800 p-4 rounded-2xl justify-between items-center shadow-[0_10px_28px_rgb(0_0_0_/_0.35)] backdrop-blur-xl">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Painel Spotify</p>
          <h2 className="text-lg font-semibold">Gestao de artistas</h2>
        </div>
        <Btn tip="cancel" className="!w-fit px-6" onClick={() => router.push('/')}>
          Sair
          <ExitToAppRoundedIcon />
        </Btn>
      </div>
      <div className="flex w-full h-full overflow-y-auto max-h-screen rounded-2xl border border-neutral-800/70 bg-black/15 p-4 md:p-6">
        {children}
      </div>
      <Navbar />
      <ToastContainer position="top-left" />
    </div>
  );
}
