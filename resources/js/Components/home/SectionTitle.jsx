import React from 'react'

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div>
        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
          {eyebrow}
        </span>
        <h2 className="mt-4 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl">{title}</h2>
      </div>
      <p className="max-w-2xl text-sm leading-7 text-slate-600 md:text-base">{description}</p>
    </div>
  );
}

export default SectionTitle