import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import GraficoMeses from './GraficoMeses'
import { cerrarSesion } from './actions'
import styles from './pivot.module.css'

const MESES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'] as const

const fmt = (n: number) => n.toLocaleString('es-AR', { maximumFractionDigits: 0 })
const fmtExacto = (n: number) => n.toLocaleString('es-AR', { minimumFractionDigits: 2 })

export default async function Pivot({
  searchParams,
}: {
  searchParams: Promise<{ anio?: string }>
}) {
  const { anio } = await searchParams
  const hoy = new Date()
  const year = Number(anio ?? hoy.getFullYear())
  const mesActual = year === hoy.getFullYear() ? hoy.getMonth() : year > hoy.getFullYear() ? -1 : 12

  const supabase = await createClient()
  const { data: auth, error: authError } = await supabase.auth.getClaims()
  if (authError || !auth?.claims) redirect('/login')
  const email = auth.claims.email

  const { data, error } = await supabase
    .from('gastos_pivot_mensual')
    .select('*')
    .order('categoria')

  if (error) return <p>Error: {error.message}</p>

  const todas = data ?? []
  const anios = [...new Set([...todas.map((f) => Number(f.anio)), hoy.getFullYear()])].sort((a, b) => b - a)
  const filas = todas.filter((f) => Number(f.anio) === year)

  const totales = MESES.map((m) => filas.reduce((s, f) => s + Number(f[m]), 0))
  const totalAnio = totales.reduce((a, b) => a + b, 0)
  const max = Math.max(1, ...filas.flatMap((f) => MESES.map((m) => Number(f[m]))))

  const claseMes = (i: number) => (i > mesActual ? styles.futuro : '')

  const datosGrafico = MESES.map((m, i) => ({
    mes: m,
    total: totales[i],
    futuro: i > mesActual,
    actual: i === mesActual,
  }))

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <h1 className={styles.titulo}>Gastos por categoría · Total {year}</h1>
            <div className={styles.totalAnio}>{'$' + fmtExacto(totalAnio)}</div>
            {email && <div className={styles.cuenta}>Sesión: {email}</div>}
          </div>
          <div className={styles.acciones}>
            <nav className={styles.anios} aria-label="Año">
              {anios.map((a) => (
                <Link
                  key={a}
                  href={`/pivot?anio=${a}`}
                  className={`${styles.anio} ${a === year ? styles.anioActivo : ''}`}
                >
                  {a}
                </Link>
              ))}
            </nav>
            <form action={cerrarSesion}>
              <button type="submit" className={styles.salir}>Cerrar sesión</button>
            </form>
          </div>
        </div>

        {filas.length > 0 && (
          <div className={`${styles.card} ${styles.cardGrafico}`}>
            <h2 className={styles.subtitulo}>Gasto por mes</h2>
            <GraficoMeses datos={datosGrafico} />
            <p className={styles.leyenda}>Verde: gastado · Azul: mes actual · Gris: cuotas proyectadas</p>
          </div>
        )}

        <div className={styles.card}>
          {filas.length === 0 ? (
            <p className={styles.sinDatos}>No hay gastos en {year}.</p>
          ) : (
            <div className={styles.scroll}>
              <table className={styles.tabla}>
                <thead>
                  <tr>
                    <th className={styles.cat}>Categoría</th>
                    {MESES.map((m, i) => (
                      <th key={m} className={i === mesActual ? styles.mesActual : claseMes(i)}>{m}</th>
                    ))}
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map((f) => (
                    <tr key={f.categoria}>
                      <th scope="row" className={styles.cat}>{f.categoria}</th>
                      {MESES.map((m, i) => {
                        const v = Number(f[m])
                        if (v <= 0) return <td key={m} className={styles.vacio}>–</td>
                        const alpha = (0.06 + 0.3 * (v / max)).toFixed(2)
                        return (
                          <td
                            key={m}
                            className={claseMes(i)}
                            style={{ background: `rgba(78,121,167,${alpha})` }}
                            title={'$' + fmtExacto(v)}
                          >
                            {fmt(v)}
                          </td>
                        )
                      })}
                      <td className={styles.totalCol}>{fmt(Number(f.total))}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th className={styles.cat}>Total</th>
                    {totales.map((t, i) => (
                      <td key={i}>{t > 0 ? fmt(t) : '–'}</td>
                    ))}
                    <td>{fmt(totalAnio)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}