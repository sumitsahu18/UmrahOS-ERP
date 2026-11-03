import { UploadCloud } from 'lucide-react'
import { Card, Field, Input, Textarea } from './ui'

export function FormRenderer({ sections }) {
  return (
    <div className="space-y-5">
      {sections.map((sec) => (
        <Card key={sec.title} title={sec.title}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {sec.fields.map(([label, type = 'text', span = 1, value]) => (
              <Field key={label} label={label} span={span}>
                {Array.isArray(type) ? (
                  <select className="input">{type.map((o) => <option key={o}>{o}</option>)}</select>
                ) : type === 'textarea' ? (
                  <Textarea defaultValue={value} />
                ) : type === 'file' ? (
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 px-3 py-2.5 text-sm text-slate-500">
                    <UploadCloud size={18} className="text-brand-500" /><span className="flex-1">Drag file or</span><label className="btn-light btn-sm cursor-pointer">Browse<input type="file" className="hidden" /></label>
                  </div>
                ) : type === 'auto' ? (
                  <Input value="Auto-generated" readOnly className="input bg-slate-50 text-slate-400" />
                ) : (
                  <Input type={type} defaultValue={value ?? (type === 'number' ? '' : undefined)} />
                )}
              </Field>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
