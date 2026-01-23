export default function Home() {
  return (
    <div className="bg-surface-base flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-8 px-8 py-12">
        {/* 토큰 테스트 섹션 */}
        <div className="w-full space-y-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-24-700 text-brand-black border-b pb-4">
            🎨 Design Token Test
          </h1>

          {/* 1. Typography */}
          <section className="space-y-4">
            <h2 className="text-20-600">1. Typography</h2>
            <div className="space-y-2 rounded bg-gray-50 p-4">
              <p className="text-24-700">Display 24px (Bold 700)</p>
              <p className="text-20-600">Title 20px (SemiBold 600)</p>
              <p className="text-18-500">Body 18px (Medium 500)</p>
              <p className="text-16-400">Body 16px (Regular 400)</p>
              <p className="text-14-400 text-disabled">
                Caption 14px (Disabled Color)
              </p>
            </div>
          </section>

          {/* 2. Colors & Backgrounds */}
          <section className="space-y-4">
            <h2 className="text-20-600">2. Colors & Backgrounds</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand-secondary-pink flex h-20 items-center justify-center rounded-lg text-white">
                Pink Secondary
              </div>
              <div className="bg-brand-primary-orange flex h-20 items-center justify-center rounded-lg text-white">
                Orange Primary
              </div>
              <div className="bg-surface-base border-light flex h-20 items-center justify-center rounded-lg border">
                Surface Base
              </div>
              <div className="bg-disabled text-disabled flex h-20 items-center justify-center rounded-lg">
                Disabled Area
              </div>
            </div>
          </section>

          {/* 3. Buttons */}
          <section className="space-y-4">
            <h2 className="text-20-600">3. Buttons</h2>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary text-16-600 px-8 py-3 transition-opacity hover:opacity-90">
                Primary Button
              </button>
              <button className="btn-slate text-brand-black border-light text-16-600 rounded-2xl border px-8 py-3">
                Secondary Button
              </button>
              <button className="btn-disabled text-16-400 cursor-not-allowed px-8 py-3">
                Disabled Button
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
