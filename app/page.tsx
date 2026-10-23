'use client'

import Image from 'next/image'
import { useState } from 'react'
import { CalendarDays, Check, Clock3, Gift, Heart, MapPin, Send, Sparkles, Star, Users } from 'lucide-react'
import { BatGlyph, Cobweb, HalloweenParticles, HangingSpider, PumpkinGlyph, SectionParticles } from '@/components/halloween'

// Edita únicamente estos datos para personalizar tu invitación.
const invitationData = {
  parents: 'Ceci & Jaime',
  date: 'Sábado 14 de noviembre',
  time: '3:00 de la tarde',
  place: 'Mar Báltico 205, Sta María del Granjeno, León',
  mapUrl: 'https://maps.app.goo.gl/4tAS2dVTC2xpvztGA',
  registryUrl: 'https://www.amazon.com.mx/baby-reg/jaime-bocanegra-diciembre-2026-leondelosaldama/3QMBGKJKKWTW4',
  whatsapp: '524774648955',
}

const details = [
  { icon: CalendarDays, label: 'Fecha', value: invitationData.date },
  { icon: Clock3, label: 'Hora', value: invitationData.time },
  { icon: MapPin, label: 'Lugar', value: invitationData.place },
]

export default function Page() {
  const [isOpened, setIsOpened] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  function openInvitation() {
    setIsOpening(true)
    window.setTimeout(() => setIsOpened(true), 1050)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') || '')
    const guests = String(formData.get('guests') || '1')
    const message = `Hola, soy ${name}. Confirmo mi asistencia al baby shower. Seremos ${guests} persona${guests === '1' ? '' : 's'}.`
    const cleanNumber = invitationData.whatsapp.replace(/\\D/g, '')
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    setConfirmed(true)
  }

  if (!isOpened) {
    return (
      <main className={`envelope-screen ${isOpening ? 'is-opening' : ''}`}>
        <div className="envelope-glow" aria-hidden="true" />
        <Cobweb position="tl" />
        <Cobweb position="tr" />
        <div className="moon" aria-hidden="true" />
        <HangingSpider className="hanging-spider" />
        <span className="float-bat bat-one" aria-hidden="true"><BatGlyph /></span>
        <span className="float-bat bat-two" aria-hidden="true"><BatGlyph /></span>
        <span className="float-bat bat-three" aria-hidden="true"><BatGlyph /></span>
        <HalloweenParticles />
        <div className="envelope-intro">
          <p className="eyebrow"><Sparkles aria-hidden="true" /> UNA INVITACIÓN ESPECIAL <Sparkles aria-hidden="true" /></p>
          <h1>Han preparado<br /><em>algo muy especial</em></h1>
          <p className="envelope-subtitle">Abre esta carta para descubrir la dulce sorpresa.</p>
        </div>
        <button className="envelope" type="button" onClick={openInvitation} disabled={isOpening} aria-label="Abrir invitación">
          <span className="envelope-flap" aria-hidden="true" />
          <span className="envelope-paper"><span>Baby<br />Shower</span><Heart aria-hidden="true" /></span>
          <span className="envelope-seal" aria-hidden="true">✦</span>
        </button>
        <p className="open-hint">Toca la carta para abrirla</p>
      </main>
    )
  }

  return (
    <main className="invitation-shell invitation-revealed">
      <HalloweenParticles />
      <div className="top-ribbon" aria-hidden="true"><span>✦</span> Una dulce espera <span>✦</span></div>
      <section className="hero-section" aria-labelledby="invitation-title">
        <div className="hero-art" aria-hidden="true" />
        <Cobweb position="tl" />
        <Cobweb position="tr" />
        <div className="moon" aria-hidden="true" />
        <span className="float-bat bat-one" aria-hidden="true"><BatGlyph /></span>
        <span className="float-bat bat-two" aria-hidden="true"><BatGlyph /></span>
        <span className="float-bat bat-three" aria-hidden="true"><BatGlyph /></span>
        <div className="hero-content">
          <div className="eyebrow"><Sparkles aria-hidden="true" /> BABY SHOWER <Sparkles aria-hidden="true" /></div>
          <p className="small-intro">Con mucha ilusión queremos compartir contigo</p>
          <h1 id="invitation-title">La llegada de<br /><em>nuestro bebé</em></h1>
          <div className="name-divider"><span>✦</span><span className="divider-line" /><span>✦</span></div>
          <p className="hero-message">Un niño está por llenar nuestros días de amor,<br className="desktop-break" /> ternura y nuevas aventuras.</p>
          <p className="parents">Con cariño, <strong>{invitationData.parents}</strong></p>
        </div>
        <div className="corner-star star-one" aria-hidden="true"><Star /></div><div className="corner-star star-two" aria-hidden="true"><Star /></div>
      </section>
      <section className="story-section" aria-labelledby="story-title">
        <Cobweb position="tl" />
        <SectionParticles count={10} seed={3} tone="light" />
        <span className="float-bat bat-one" aria-hidden="true"><BatGlyph /></span>
        <div className="story-image-wrap">
          <div className="ultrasound-frame">
            <Image src="/ultrasonido.jpeg" alt="Ultrasonido de nuestro bebé" fill sizes="(max-width: 700px) 90vw, 420px" className="story-image" />
          </div>
        </div>
        <div className="story-copy"><p className="section-kicker">UN PEQUEÑO MILAGRO</p><h2 id="story-title">“A veces las cosas más pequeñas ocupan el mayor espacio en nuestro corazón.”</h2><div className="quote-mark" aria-hidden="true">“</div><p>Estamos contando los días para conocerte, abrazarte y descubrir juntos la magia de ser tus papás.</p></div>
      </section>
      <section className="details-section" aria-labelledby="details-title"><Cobweb position="tr" /><SectionParticles count={12} seed={11} tone="light" /><span className="float-bat bat-two" aria-hidden="true"><BatGlyph /></span><PumpkinGlyph className="details-pumpkin" /><p className="section-kicker">MARCA LA FECHA</p><h2 id="details-title">Te esperamos para celebrar</h2><div className="details-grid">{details.map(({ icon: Icon, label, value }) => <div className="detail-item" key={label}><div className="detail-icon"><Icon aria-hidden="true" /></div><p>{label}</p><strong>{value}</strong></div>)}</div><div className="minimap"><iframe src="https://www.google.com/maps?q=21.0941614,-101.6576172&hl=es&z=17&output=embed" title="Ubicación: Mar Báltico 205" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div><a className="map-link" href={invitationData.mapUrl} target="_blank" rel="noreferrer"><MapPin aria-hidden="true" /> Ver ubicación</a></section>
      <section className="rsvp-section" aria-labelledby="rsvp-title"><SectionParticles count={14} seed={23} tone="dark" /><Cobweb position="br" /><HangingSpider className="hanging-spider hanging-spider-rsvp" /><div className="rsvp-copy"><div className="soft-icon"><Heart aria-hidden="true" /></div><p className="section-kicker">TU PRESENCIA ES EL MEJOR REGALO</p><h2 id="rsvp-title">¿Nos acompañas?</h2><p>Confírmanos tu asistencia y te llevaremos directo a WhatsApp.</p><div className="gift-note"><Gift aria-hidden="true" /><span>Si deseas hacernos un regalo, agradeceremos tu aporte para el futuro de nuestro bebé.</span></div><div className="registry-wrap"><a className="registry-button" href={invitationData.registryUrl} target="_blank" rel="noopener noreferrer"><Gift aria-hidden="true" /> Ver mesa de regalos</a></div></div><div className="rsvp-card">{confirmed ? <div className="success-state" role="status"><div className="success-icon"><Check aria-hidden="true" /></div><h3>¡Qué alegría!</h3><p>WhatsApp se abrió con tu mensaje listo para enviar.</p><button type="button" className="text-button" onClick={() => setConfirmed(false)}>Enviar otra confirmación</button></div> : <form onSubmit={handleSubmit}><label htmlFor="name">Tu nombre</label><input id="name" name="name" placeholder="Escribe tu nombre" required /><label htmlFor="guests">¿Cuántas personas asistirán?</label><select id="guests" name="guests" defaultValue="1"><option value="1">Solo yo</option><option value="2">2 personas</option><option value="3">3 personas</option><option value="4">4 personas</option></select><p className="input-help">La confirmación se enviará directamente al WhatsApp de los papás.</p><button className="submit-button" type="submit"><Send aria-hidden="true" /> Confirmar por WhatsApp</button></form>}</div></section>
      <section className="blessing-section" aria-label="Frase para nuestro bebé"><SectionParticles count={8} seed={19} tone="dark" /><PumpkinGlyph className="blessing-pumpkin" /><Sparkles aria-hidden="true" /><p>Te esperamos con el corazón lleno de amor</p><Sparkles aria-hidden="true" /><PumpkinGlyph className="blessing-pumpkin blessing-pumpkin-alt" /></section>
      <footer><Users aria-hidden="true" /><span>Hecho con amor para celebrar una nueva vida</span><Users aria-hidden="true" /></footer>
    </main>
  )
}
