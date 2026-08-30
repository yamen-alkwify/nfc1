import { defineConfig } from "vite";

const vcardFileName = "Obayda-Abdul-Baky.vcf";
const vcardContent = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "N:Abdul Baky;Obayda;;;",
  "FN:Obayda Abdul Baky",
  "ORG:CHAM HOLDING",
  "TEL;TYPE=CELL:+963986333334",
  "TEL;TYPE=CELL:+963991239999",
  "EMAIL;TYPE=WORK:Obayda.abdulbaky@chamholding.sy",
  "URL;TYPE=WORK:https://damacham.sy/",
  "ADR;TYPE=WORK:;;The Eight Gate;Yafour;Damascus;;Syria",
  "END:VCARD",
  "",
].join("\r\n");

function vcardPlugin() {
  const serveVcard = (request, response, next) => {
    const pathname = new URL(request.url, "http://localhost").pathname;
    if (pathname !== `/${vcardFileName}`) {
      next();
      return;
    }

    response.statusCode = 200;
    response.setHeader("Content-Type", "text/vcard; charset=utf-8");
    response.setHeader("Content-Disposition", `inline; filename="${vcardFileName}"`);
    response.setHeader("Cache-Control", "no-store");
    response.end(vcardContent);
  };

  return {
    name: "obayda-vcard",
    configureServer(server) {
      server.middlewares.use(serveVcard);
    },
    configurePreviewServer(server) {
      server.middlewares.use(serveVcard);
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: vcardFileName, source: vcardContent });
    },
  };
}

export default defineConfig({
  plugins: [vcardPlugin()],
  server: {
    host: "0.0.0.0",
    allowedHosts: [".trycloudflare.com"],
  },
});
