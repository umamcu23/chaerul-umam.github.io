const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

const mouseGlow = $(".mouse-glow");
const cursorDot = $(".cursor-dot");

window.addEventListener("mousemove", (e) => {
  mouseGlow.style.left = `${e.clientX}px`;
  mouseGlow.style.top = `${e.clientY}px`;
  cursorDot.style.left = `${e.clientX}px`;
  cursorDot.style.top = `${e.clientY}px`;
});

document.addEventListener("mouseover", (e) => {
  if (e.target.closest("a, button, .project-card, .skill-card, .credential-card")) {
    cursorDot.style.transform = "translate(-50%,-50%) scale(2.2)";
    cursorDot.style.opacity = ".18";
  }
});
document.addEventListener("mouseout", (e) => {
  if (e.target.closest("a, button, .project-card, .skill-card, .credential-card")) {
    cursorDot.style.transform = "translate(-50%,-50%) scale(1)";
    cursorDot.style.opacity = ".45";
  }
});

const progress = $(".progress");
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
});

const nav = $("#nav");
const menuBtn = $(".menu-btn");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
$$(".nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold: .12});
$$(".reveal").forEach(el => observer.observe(el));

$$("[data-tilt]").forEach(card => {
  card.addEventListener("mousemove", e => {
    if (window.innerWidth < 900) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-3px)`;
  });
  card.addEventListener("mouseleave", () => card.style.transform = "");
});

const projects = {
  simpel: {
    type: "Government System",
    title: "SIMPEL 4.0",
    client: "Ministry of Communication and Informatics (Komdigi)",
    description: "Developed application functionality and supported integration requirements including BSrE digital signature, QR Code, and document generation. The CV lists Laravel 11 and PostgreSQL as the main stack.",
    image: "assets/img/simpel-1.jpg",
    gallery: ["assets/img/simpel-1.jpg","assets/img/simpel-2.jpg","assets/img/simpel-3.jpg"],
    tags: ["Laravel 11","PostgreSQL","BSrE Digital Signature API","QR Code","Generate DOCX to PDF"]
  },
  amdalnet: {
    type: "Government System",
    title: "RKL-RPL / Amdalnet",
    client: "Ministry of Environment and Forestry (KLHK)",
    description: "Developed and maintained web application functionality for RKL-RPL / Amdalnet, including document-related functionality and cloud storage support.",
    image: "assets/img/amdalnet.jpg",
    gallery: ["assets/img/amdalnet.jpg"],
    tags: ["Laravel 9","PHP 8.1","PostgreSQL","OnlyOffice","PHPDocX","AWS S3"]
  },
  migas: {
    type: "Government System",
    title: "WK-MIGAS",
    client: "Ministry of Energy and Mineral Resources (ESDM)",
    description: "Worked as a Full Stack Developer developing and maintaining the WK-MIGAS web application, using Redis to support application performance and data handling.",
    image: "assets/img/wk-migas.jpg",
    gallery: ["assets/img/wk-migas.jpg"],
    tags: ["CodeIgniter 3.1","PHP 8.1","MySQL / MariaDB","Redis","Bootstrap","JavaScript"]
  },
  sis: {
    type: "Client Application",
    title: "Sales Information System (SiS)",
    client: "PT. Mitra Info Sarana",
    description: "Modified and enhanced the Sales Information System, debugged application issues, and supported application maintenance and data workflows.",
    image: "assets/img/sis.jpg",
    gallery: ["assets/img/sis.jpg"],
    tags: ["CodeIgniter 3.1","PHP 7","MySQL / MariaDB","JavaScript","jQuery"]
  },
  umaystory: {
    type: "Personal Project",
    title: "UmayStory",
    client: "Personal Website",
    description: "Personal web project focused on presenting content and implementing QR Code scanning functionality.",
    image: "assets/img/umaystory.jpg",
    gallery: ["assets/img/umaystory.jpg"],
    tags: ["CodeIgniter 3.1","PHP 8.1","MySQL / MariaDB","QR Code"]
  },
  inventory: {
    type: "Internal Business System",
    title: "Inventory Management System",
    client: "PT Sun Kertas Prima",
    description: "Web-based inventory system covering warehouse operations, stock movement, supplier data, users, reporting, and operational dashboards.",
    image: "assets/img/inventory-1.jpg",
    gallery: ["assets/img/inventory-1.jpg","assets/img/inventory-2.jpg"],
    tags: ["Laravel 10.8","PHP 8.2","MySQL","Inventory","Reporting"]
  }
};

const modal = $("#projectModal");
const modalImage = $("#modalImage");
const modalImageWrap = $("#modalImageWrap");
const modalTitle = $("#modalTitle");
const modalType = $("#modalType");
const modalClient = $("#modalClient");
const modalDescription = $("#modalDescription");
const modalTags = $("#modalTags");
const modalGallery = $("#modalGallery");
const projectPrev = $("#projectPrev");
const projectNext = $("#projectNext");

const projectOrder = ["simpel", "amdalnet", "migas", "sis", "umaystory", "inventory"];
let activeProjectKey = null;
let activeGalleryIndex = 0;

const lightbox = $("#imageLightbox");
const lightboxImage = $("#lightboxImage");
const lightboxCaption = $("#lightboxCaption");
const lightboxPrev = $("#lightboxPrev");
const lightboxNext = $("#lightboxNext");
const lightboxClose = $("#lightboxClose");

function renderProject(key, direction = 0) {
  const p = projects[key];
  if (!p) return;
  activeProjectKey = key;
  activeGalleryIndex = Math.max(0, p.gallery.indexOf(p.image));
  modalImage.src = p.gallery[activeGalleryIndex] || p.image;
  modalImage.alt = `${p.title} screenshot`;
  modalTitle.textContent = p.title;
  modalType.textContent = p.type;
  modalClient.textContent = p.client;
  modalDescription.textContent = p.description;
  modalTags.innerHTML = p.tags.map(t => `<span>${t}</span>`).join("");
  modalGallery.innerHTML = p.gallery.map((src, i) => `
    <button class="gallery-thumb ${i === activeGalleryIndex ? "active" : ""}" data-gallery-index="${i}" aria-label="Preview ${p.title} image ${i + 1}">
      <img src="${src}" alt="${p.title} screenshot ${i + 1}" loading="lazy">
    </button>`).join("");

  modalGallery.querySelectorAll(".gallery-thumb").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      setGalleryImage(Number(btn.dataset.galleryIndex), true);
    });
  });

  const pos = projectOrder.indexOf(key);
  projectPrev.disabled = pos <= 0;
  projectNext.disabled = pos >= projectOrder.length - 1;
  modalBoxAnimate(direction);
}

function modalBoxAnimate(direction) {
  const box = $(".modal-box");
  box.classList.remove("project-switch-next", "project-switch-prev");
  void box.offsetWidth;
  if (direction > 0) box.classList.add("project-switch-next");
  if (direction < 0) box.classList.add("project-switch-prev");
}

function setGalleryImage(index, animate = false) {
  const p = projects[activeProjectKey];
  if (!p || !p.gallery[index]) return;
  activeGalleryIndex = index;
  if (animate) {
    modalImage.classList.remove("image-swap");
    void modalImage.offsetWidth;
    modalImage.classList.add("image-swap");
  }
  modalImage.src = p.gallery[index];
  modalImage.alt = `${p.title} screenshot ${index + 1}`;
  modalGallery.querySelectorAll(".gallery-thumb").forEach((thumb, i) => {
    thumb.classList.toggle("active", i === index);
  });
}

function openProject(key, direction = 0) {
  if (!projects[key]) return;
  renderProject(key, direction);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function switchProject(step) {
  if (!activeProjectKey) return;
  const current = projectOrder.indexOf(activeProjectKey);
  const next = current + step;
  if (next < 0 || next >= projectOrder.length) return;
  renderProject(projectOrder[next], step);
}

function closeProject() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  closeLightbox();
}

function openLightbox(index = activeGalleryIndex) {
  const p = projects[activeProjectKey];
  if (!p || !p.gallery[index]) return;
  activeGalleryIndex = index;
  lightboxImage.src = p.gallery[index];
  lightboxImage.alt = `${p.title} screenshot ${index + 1}`;
  lightboxCaption.textContent = `${p.title} · ${index + 1} / ${p.gallery.length}`;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}

function switchLightbox(step) {
  const p = projects[activeProjectKey];
  if (!p || p.gallery.length < 2) return;
  const next = (activeGalleryIndex + step + p.gallery.length) % p.gallery.length;
  setGalleryImage(next, true);
  openLightbox(next);
}

$$('.project-card').forEach(card => card.addEventListener('click', () => openProject(card.dataset.project)));
projectPrev.addEventListener('click', e => { e.stopPropagation(); switchProject(-1); });
projectNext.addEventListener('click', e => { e.stopPropagation(); switchProject(1); });

let projectTouchStartX = null;
modal.addEventListener('touchstart', e => {
  if (e.touches.length === 1) projectTouchStartX = e.touches[0].clientX;
}, {passive:true});
modal.addEventListener('touchend', e => {
  if (projectTouchStartX === null) return;
  const delta = e.changedTouches[0].clientX - projectTouchStartX;
  projectTouchStartX = null;
  if (Math.abs(delta) < 65) return;
  switchProject(delta < 0 ? 1 : -1);
}, {passive:true});
$(".modal-close").addEventListener("click", closeProject);
$(".modal-backdrop").addEventListener("click", closeProject);
modalImageWrap.addEventListener("click", () => openLightbox(activeGalleryIndex));
lightboxClose.addEventListener("click", closeLightbox);
lightbox.querySelector("[data-close-lightbox]").addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => switchLightbox(-1));
lightboxNext.addEventListener("click", () => switchLightbox(1));

document.addEventListener("keydown", e => {
  if (lightbox.classList.contains("open")) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") switchLightbox(-1);
    if (e.key === "ArrowRight") switchLightbox(1);
    return;
  }
  if (!modal.classList.contains("open")) return;
  if (e.key === "Escape") closeProject();
  if (e.key === "ArrowLeft") switchProject(-1);
  if (e.key === "ArrowRight") switchProject(1);
});

/* Professional welcome animation: short, quiet, and easy to skip. */
const welcomeScreen = $("#welcomeScreen");
window.addEventListener("load", () => {
  if (!welcomeScreen) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const delay = reduced ? 120 : 1050;
  window.setTimeout(() => {
    welcomeScreen.classList.add("is-hidden");
    window.setTimeout(() => welcomeScreen.remove(), reduced ? 100 : 800);
  }, delay);
});

$("#year").textContent = new Date().getFullYear();


/* Object-aware pointer position: used by card/button radial highlights. */
function setPointerVars(el, event){
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${event.clientX - r.left}px`);
  el.style.setProperty("--my", `${event.clientY - r.top}px`);
}

$$(".project-card, .skill-card, .credential-card, .education-card, .btn").forEach(el => {
  el.addEventListener("pointermove", e => setPointerVars(el, e));
});

$$(".magnetic").forEach(btn => {
  btn.addEventListener("pointermove", e => {
    if (window.innerWidth < 800) return;
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.12;
    const y = (e.clientY - r.top - r.height / 2) * 0.16;
    btn.style.transform = `translate(${x}px,${y}px) translateY(-3px)`;
  });
  btn.addEventListener("pointerleave", () => {
    btn.style.transform = "";
  });
});

const profilePhoto = $("[data-photo-tilt]");
if (profilePhoto) {
  profilePhoto.addEventListener("pointermove", e => {
    if (window.innerWidth < 800) return;
    const r = profilePhoto.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    profilePhoto.style.transform =
      `perspective(700px) rotateX(${y * -8}deg) rotateY(${x * 9}deg)`;
  });
  profilePhoto.addEventListener("pointerleave", () => {
    profilePhoto.style.transform = "";
  });
}

/* V5 — richer card motion */
$$(".experience-card, .project-card, .skill-card, .credential-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  });
  card.addEventListener("mouseleave", () => {
    card.style.removeProperty("--mx");
    card.style.removeProperty("--my");
  });
});
$$(".experience-card li").forEach(item => {
  item.addEventListener("mouseenter", () => {
    item.parentElement.querySelectorAll("li").forEach(other => { if (other !== item) other.style.opacity = ".72"; });
  });
  item.addEventListener("mouseleave", () => {
    item.parentElement.querySelectorAll("li").forEach(other => { other.style.opacity = ""; });
  });
});
