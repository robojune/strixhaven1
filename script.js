const content = document.getElementById("content");
const navButtons = document.querySelectorAll(".main-nav button");

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    loadSection(btn.dataset.section);
  });
});

async function loadJSON(path) {
  const res = await fetch(path);
  return res.json();
}

/* Past Adventures */

async function renderAdventures() {
  const adventures = await loadJSON("data/adventures.json");

  content.innerHTML = `
    <section>
      <div class="section-header">
        <h2>Past Adventures</h2>
        <p class="section-subtitle">Key arcs from the Strixhaven campaign, as chronicled by the Quandrix Quill.</p>
      </div>
      <div class="card-grid">
        ${adventures
          .map(
            (a) => `
          <article class="card">
            <p class="meta-line">${a.date} • ${a.arc}</p>
            <h3>${a.title}</h3>
            <p>${a.summary}</p>
            ${
              a.details
                ? `<details><summary>Read full account</summary><p>${a.details}</p></details>`
                : ""
            }
          </article>
        `
          )
          .join("")}
      </div>
    </section>
  `;
}

/* Heroes of Strixhaven */

async function renderHeroes() {
  const heroes = await loadJSON("data/heroes.json");

  content.innerHTML = `
    <section>
      <div class="section-header">
        <h2>Heroes of Strixhaven</h2>
        <p class="section-subtitle">The students, schemers, and accidental legends shaping the Shifting Semester.</p>
      </div>
      <div class="card-grid">
        ${heroes
          .map(
            (h) => `
          <article class="card hero-card">
            <img src="${h.portrait}" alt="${h.name}" />
            <div>
              <h3 class="hero-name">${h.name}</h3>
              <p class="hero-meta">
                <span class="badge badge-teal">${h.college}</span>
                <span class="badge badge-gold">${h.role}</span>
              </p>
              <p>${h.bio}</p>
              ${
                h.stats
                  ? `<p class="meta-line">
                      Courage: ${h.stats.courage} • Chaos: ${h.stats.chaos} • Academics: ${h.stats.academics}
                    </p>`
                  : ""
              }
            </div>
          </article>
        `
          )
          .join("")}
      </div>
    </section>
  `;
}

/* Monthly Newsletter */

async function renderNewsletters() {
  const newsletters = await loadJSON("data/newsletters.json");
  const first = newsletters[0];

  content.innerHTML = `
    <section>
      <div class="section-header">
        <h2>Monthly Newsletter</h2>
        <p class="section-subtitle">The Quandrix Quill editions, archived for posterity (and future exam questions).</p>
      </div>
      <div class="newsletter-layout">
        <aside class="newsletter-list">
          <h3>Issues</h3>
          <ul>
            ${newsletters
              .map(
                (n, idx) => `
              <li data-id="${n.id}" class="${idx === 0 ? "active" : ""}">
                ${n.month} • ${n.volume}
              </li>
            `
              )
              .join("")}
          </ul>
        </aside>
        <article class="newsletter-content" id="newsletter-content">
          ${renderNewsletterContent(first)}
        </article>
      </div>
    </section>
  `;

  const listItems = document.querySelectorAll(".newsletter-list li");
  const contentEl = document.getElementById("newsletter-content");

  listItems.forEach((li) => {
    li.addEventListener("click", () => {
      listItems.forEach((x) => x.classList.remove("active"));
      li.classList.add("active");
      const id = li.dataset.id;
      const issue = newsletters.find((n) => n.id === id);
      contentEl.innerHTML = renderNewsletterContent(issue);
    });
  });
}

function renderNewsletterContent(issue) {
  if (!issue) return "<p>No issue selected.</p>";

  return `
    <p class="meta-line">${issue.month} • ${issue.volume}</p>
    <h3>${issue.title}</h3>
    <p>${issue.lede}</p>

    ${
      issue.sections
        .map(
          (sec) => `
      <h4>${sec.heading}</h4>
      <p>${sec.body}</p>
    `
        )
        .join("")
    }

    ${
      issue.rumors && issue.rumors.length
        ? `
      <h4>Rumors & Whispers</h4>
      <ul>
        ${issue.rumors.map((r) => `<li>${r}</li>`).join("")}
      </ul>
    `
        : ""
    }

    ${
      issue.highlights && issue.highlights.length
        ? `
      <h4>Game Day Highlights</h4>
      <ul>
        ${issue.highlights.map((h) => `<li>${h}</li>`).join("")}
      </ul>
    `
        : ""
    }
  `;
}

/* Gossip Column */

async function renderGossip() {
  const gossip = await loadJSON("data/gossip.json");

  content.innerHTML = `
    <section>
      <div class="section-header">
        <h2>Gossip Column</h2>
        <p class="section-subtitle">The Tangled Vines of Quandrix – where rumors grow faster than fractals.</p>
      </div>
      <p class="gossip-intro">
        Unverified, unfiltered, and undeniably entertaining. Read at your own risk; quote at your own peril.
      </p>
      <div class="card-grid">
        ${gossip
          .map(
            (g) => `
          <article class="card">
            <p class="meta-line">${g.tag}</p>
            <h3>${g.headline}</h3>
            <p>${g.body}</p>
            ${
              g.quote
                ? `<p><em>"${g.quote}"</em></p>`
                : ""
            }
          </article>
        `
          )
          .join("")}
      </div>
    </section>
  `;
}

/* Initial load */

loadSection("adventures");

function loadSection(section) {
  switch (section) {
    case "adventures":
      renderAdventures();
      break;
    case "heroes":
      renderHeroes();
      break;
    case "newsletters":
      renderNewsletters();
      break;
    case "gossip":
      renderGossip();
      break;
  }
}
