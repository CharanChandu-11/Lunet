import { Suspense } from "react";
import PixelBlast from "@/components/PixelBlast";
import { RoomAccessForm } from "@/components/room-access-form";

export default async function Page({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const roomId = params.room?.toString() || "";

  return (
    <>
      {/* Background Layers */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-[#04011f]"
        role="presentation"
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-gradient-to-tr from-[]/50 via-[#]/50 to-90% to-[#ffff]/50"
        role="presentation"
      />
      <div className="dark fixed inset-0 -z-10">
        <PixelBlast className="" style={{}} />
      </div>

      {/* Centered Main Content */}
      <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-6 text-center">
        <div className="w-full max-w-xl space-y-8">
          {/* Heading */}
          <h1 className="flex flex-col items-center justify-center gap-2 font-bold text-4xl text-foreground tracking-tight sm:text-6xl">
            <span>Code Talk Chat </span>
            <span className="flex items-end justify-center gap-2">
              <span>on </span>
              <span className="bg-gradient-to-r from-[#913efc] to-[#2565cb] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
                Lunet
              </span>
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-lg text-foreground/90 text-lg sm:text-xl"></p>

          {/* Form */}
          <Suspense fallback={null}>
            <RoomAccessForm roomId={roomId} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
