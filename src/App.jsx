import React from 'react';
import Header from './components/Header';
import Gallery from './components/Gallery';
import Photo from './components/Photo';
import Menu from './components/Menu';
import ContactForm from './components/ContactForm';
import { biographies } from './data/story';
import { steps, navigation, contact } from './data/content';
const Eyebrow = ({ children }) => <p className="eyebrow">{children}</p>;

export default function App() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header/>
    <main id="main">
      <section className="hero" id="home" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <Eyebrow>Canapés | Private dining | Catering</Eyebrow>
          <h1 id="hero-heading">Two crafts.<br/>One <em>experience.</em></h1>
          <p className="intro">We exist to transform small gatherings into unforgettable moments, where food, drink, and service converge seamlessly at the table.</p>
          <a className="text-link hero-cta" href="#experience">DISCOVER THE EXPERIENCE</a>
        </div>
        <div className="hero-art"><Photo image="food-and-drink" alt="A coupe glass paired with a plated dish against a dark textured backdrop" variant="hero-media" priority/></div>
      </section>
      <section id="story" className="section story" aria-labelledby="story-heading">
        <Photo image="team-at-an-event" alt="Two members of the Convergence team speaking beside a table prepared for service" variant="story-photo"/>
        <div className="story-body"><Eyebrow>01 / Our story</Eyebrow><h2 id="story-heading">Shared <em>vision.</em></h2>
          {biographies.map((text, index) => <p key={index}>{text}</p>)}
        </div>
      </section>
      <section id="experience" className="section experience" aria-labelledby="experience-heading">
        <div className="section-heading"><div><Eyebrow>02 / The experience</Eyebrow><h2 id="experience-heading">Your space.<br/>Our <em>craft.</em></h2></div></div>
        <p className="experience-intro">A dining experience shaped around you, brought to your chosen location.</p>
        <div className="steps">{steps.map(([title, description], i) => <article key={title}><span className="step-number">0{i + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>
      <Menu/>
      <section id="gallery" className="section gallery" aria-labelledby="gallery-heading">
        <div className="section-heading"><div><Eyebrow>04 / Gallery</Eyebrow><h2 id="gallery-heading">A taste of<br/><em>Convergence.</em></h2></div></div>
        <Gallery/>
      </section>
      <section id="contact" className="section contact" aria-labelledby="contact-heading">
        <Photo image="pouring-a-pairing" alt="A drink being strained into a coupe glass at an event" variant="contact-photo"/>
        <div className="contact-body"><Eyebrow>Begin a conversation</Eyebrow><h2 id="contact-heading">Bring Convergence<br/>to <em>your table.</em></h2>
          <p className="lead">From intimate gatherings to memorable celebrations, discover a dining experience thoughtfully created for your occasion.</p>
          <ContactForm/>
        </div>
      </section>
    </main>
    <footer>
      <a className="wordmark" href="#home"><img src="/images/convergence-logo.png" width="450" height="142" alt="Convergence"/></a>
      <nav aria-label="Footer navigation">{navigation.map(([id,label]) => <a href={`#${id}`} key={id}>{label}</a>)}</nav>
      <a className="instagram-link" href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Convergence on Instagram (opens in a new tab)"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg></a>
      <p>© {new Date().getFullYear()} Convergence Hospitality Inc.</p>
    </footer>
    <a className="back-to-top" href="#home" aria-label="Return to top"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 20V4m-7 7 7-7 7 7"/></svg></a>
  </>;
}
