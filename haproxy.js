import { createApp, reactive, nextTick } from "./petite-vue.es.js";

const matrix = {
  // BEGIN-MATRIX
  // Debian
  stretch: { "2.0": "hdn+", 2.2: "hdn+" },
  buster: {
    "2.0": "hdn+",
    2.2: "hdn+",
    2.4: "hdn+",
    2.6: "hdn+",
    2.7: "hdn+",
  },
  bullseye: {
    2.2: "official-",
    2.4: "hdn+",
    2.6: "backports-|hdn+",
    2.7: "hdn+",
    2.8: "hdn+",
  },
  bookworm: { 2.6: "official-|hdn+|backports+", 2.8: "hdn+" },
  sid: { 2.6: "official+", 2.8: "experimental+" },
  // Ubuntu
  xenial: { "2.0": "ppa+" },
  bionic: {
    "2.0": "ppa+",
    2.2: "ppa+",
    2.4: "ppa+",
    2.6: "ppa+",
    2.7: "ppa+",
  },
  focal: {
    "2.0": "official-|ppa+",
    2.2: "ppa+",
    2.4: "ppa+",
    2.6: "ppa+",
    2.7: "ppa+",
    2.8: "ppa+",
  },
  jammy: {
    2.4: "official-|ppa+",
    2.6: "ppa+",
    2.7: "ppa+",
    2.8: "ppa+",
  },
  kinetic: { 2.4: "official-" },
  lunar: { 2.6: "official-" },
  // END-MATRIX
};

createApp({
  // Supported distributions
  distributions: {
    Debian: {
      stretch: "Stretch (9)",
      buster: "Buster (10)",
      bullseye: "Bullseye (11)",
      bookworm: "Bookworm (12)",
      sid: "Sid (unstable)",
    },
    Ubuntu: {
      xenial: "Xenial (16.04 LTS)",
      bionic: "Bionic (18.04 LTS)",
      focal: "Focal (20.04 LTS)",
      jammy: "Jammy (22.04 LTS)",
      kinetic: "Kinetic (22.10)",
      lunar: "Lunar (23.04)",
    },
  },

  // HAProxy versions
  versions: {
    "2.0": "2.0-stable (LTS)",
    2.2: "2.2-stable (LTS)",
    2.4: "2.4-stable (LTS)",
    2.6: "2.6-stable (LTS)",
    2.7: "2.7-stable",
    2.8: "2.8-stable (LTS)",
  },

  // Helper function to build Debian repository URL
  debian(release, subrelease) {
    var suffix = "debian";
    var distribution = subrelease ? [release, subrelease].join("-") : release;
    return `http://deb.debian.org/${suffix} ${distribution}`;
  },

  // Selected versions
  selected: {},

  // Proposed solutions
  solutions() {
    const { distribution, release, version } = this.selected;
    if (!distribution || !release || !version) return [];

    const proposed = matrix[release]?.[version];
    const solutions = (proposed ?? "unavailable").split("|");
    const current = solutions.map((solution) => ({
      version: { "+": "latest", "-": "stable" }[solution.slice(-1)] ?? null,
      distribution: solution.replace(/\+|\-$/, ""),
      id: solution,
    }));
    return current;
  },

  // Put selection in URL
  updateLocation() {
    const { distribution, release, version } = this.selected;
    if (distribution && release && version) {
      window.location = `#distribution=${distribution}&release=${release}&version=${version}`;
    }
  },
  updateFromLocation() {
    const location = window.location.hash.slice(1).replace(/^\?+/, "");
    const { distribution, release, version } = Object.fromEntries(
      location.split("&").map((v) => v.split("="))
    );
    if (distribution && release && version) {
      this.selected.distribution = distribution;
      this.selected.release = release;
      this.selected.version = version;
    }
  },
  mounted(el) {
    addEventListener("hashchange", this.updateFromLocation);
    this.updateFromLocation();
    nextTick(() => el.classList.add("js"));
  },
}).mount();
