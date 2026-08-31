import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const contact = {
  firstName: "Obayda",
  lastName: "Abdul Baky",
  fullName: "Obayda Abdul Baky",
  company: "CHAM HOLDING",
  phone1: "+963986333334",
  phone2: "+963991239999",
  email: "Obayda.abdulbaky@chamholding.sy",
  website: "https://damacham.sy/",
  address: "Yafour, The Eight Gate, Damascus, Syria",
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const toast = document.querySelector("#toast");
const toastText = toast.querySelector("span:last-child");
const menuButton = document.querySelector("#menuButton");
const quickMenu = document.querySelector("#quickMenu");
let toastTimer;

function showToast(message) {
  toastText.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function downloadContact() {
  const fileUrl = new URL(`${import.meta.env.BASE_URL}Obayda-Abdul-Baky.vcf`, window.location.origin).href;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) {
    window.location.assign(fileUrl);
    return;
  }

  const downloadLink = document.createElement("a");
  downloadLink.href = fileUrl;
  downloadLink.download = "Obayda-Abdul-Baky.vcf";
  downloadLink.type = "text/vcard";
  downloadLink.style.display = "none";
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();

  const button = document.querySelector("#contactButton");
  button.classList.add("is-saved");
  window.setTimeout(() => button.classList.remove("is-saved"), 1700);
  showToast("تم تنزيل جهة الاتصال");
}

document.querySelector("#contactButton").addEventListener("click", downloadContact);

document.querySelector("#shareButton").addEventListener("click", async () => {
  const shareData = {
    title: contact.fullName,
    text: `بطاقة التواصل الخاصة بـ ${contact.fullName}`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast("تم نسخ رابط البطاقة");
    }
  } catch (error) {
    if (error.name !== "AbortError") showToast("تعذّرت المشاركة");
  }
});

function setMenu(open) {
  menuButton.classList.toggle("is-open", open);
  quickMenu.classList.toggle("is-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
}

menuButton.addEventListener("click", () => {
  setMenu(!quickMenu.classList.contains("is-open"));
});

quickMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

function initAnimations() {
  if (reducedMotion) return;

  const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro
    .from(".brand-logo, .menu-button", { y: -12, opacity: 0, stagger: 0.08, duration: 0.52 })
    .from(".arch-ornament", { opacity: 0, duration: 0.5 }, "-=0.32")
    .from(".identity > *", { y: 14, opacity: 0, stagger: 0.055, duration: 0.42 }, "-=0.2");

  gsap.utils.toArray("[data-reveal]").forEach((element) => {
    gsap.from(element, {
      y: 24,
      opacity: 0,
      duration: 0.58,
      ease: "power3.out",
      scrollTrigger: { trigger: element, start: "top 92%", once: true },
    });
  });
}

initAnimations();
