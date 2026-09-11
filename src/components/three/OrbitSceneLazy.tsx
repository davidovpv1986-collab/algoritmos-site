"use client";

import dynamic from "next/dynamic";

/**
 * Клиентская обёртка для ленивой загрузки 3D-сцены:
 * three.js не попадает в серверный бандл и подгружается после первого рендера.
 */
const OrbitScene = dynamic(() => import("./OrbitScene"), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0"
      role="img"
      aria-label="Абстрактная трёхмерная орбита — символ системного подхода Алгоритмос"
    >
      <div className="absolute left-1/2 top-1/2 aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#8FC4BE_0%,#2DA8A4_28%,#0B2E3D_68%,transparent_72%)] opacity-60" />
    </div>
  ),
});

export default function OrbitSceneLazy() {
  return <OrbitScene />;
}
